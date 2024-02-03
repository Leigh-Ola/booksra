import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource, In, Raw } from 'typeorm';
import { throwBadRequest } from '../utils/helpers';
import {
  PaymentStatusEnum,
  FeesSplit,
  EmailStatusEnum,
  EmailTypeEnum,
  MessageTypesEnum,
} from '../utils/types';
import {
  CalculatePurchaseDto,
  NewPurchaseDto,
  GetPurchasesDto,
} from './dto/purchases.dto';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import { Data } from '../misc/data.entity';
import { Discount } from '../discount/discount.entity';
import { Location } from '../location/location.entity';
import { Purchase } from '../purchases/purchase.entity';
import { SplitPurchase } from '../purchases/splitPurchase.entity';
import { generateRandomString } from '../utils/helpers';
import { toNumber, multiply, divide, subtract, max, add, pick } from 'lodash';
import {
  DiscountTypeEnum,
  DiscountCategoryEnum,
  DeliveryTypeEnum,
  CouponTypeEnum,
} from '../utils/types';
import axios from 'axios';
import { Email } from '../misc/email.entity';
import { purchaseCompleteTemplate } from '../mail/templates/purchase-complete';
import { sendMail } from '../mail/mail.service';

@Injectable()
export class PurchasesService {
  manager: EntityManager;
  constructor(private dbSource: DataSource) {
    this.manager = this.dbSource.manager;
  }

  async checkIfPurchasesAreEnabled() {
    let dataFromDb = await this.manager.findOne(Data, {
      where: {
        type: MessageTypesEnum.PURCHASE_AVAILABILITY,
        isBoolean: true,
      },
    });
    if (!dataFromDb) {
      return true;
    }
    const data = dataFromDb.data || null;
    let parsed: any;
    try {
      parsed = JSON.parse(data);
    } catch (error) {
      return throwBadRequest(
        'Unable to determine purchase availability status',
      );
    }
    if (parsed === true) {
      return true;
    } else {
      return throwBadRequest('Purchases are currently disabled');
    }
  }

  async getAllPurchases(query: GetPurchasesDto) {
    const {
      page: page_,
      limit: limit_,
      date,
      userId,
      locationId,
      ...filters
    } = query;
    if (filters?.isDiscountApplied) {
      filters.isDiscountApplied =
        String(filters.isDiscountApplied).toLowerCase() === 'true';
    }
    if (filters?.isDelivery) {
      filters.isDelivery = String(filters.isDelivery).toLowerCase() === 'true';
    }
    const where = {
      ...filters,
    };
    let page = Number(page_) || 1;
    let limit = Number(limit_) || 10;
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 1 : limit > 100 ? 100 : limit;
    if (date) {
      // Purchase.createdAt must matchthe day, month and year of the date provided
      const dateObj = new Date(date);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1; // JavaScript months are 0-11
      const year = dateObj.getFullYear();
      where['createdAt'] = Raw(
        (alias) =>
          `EXTRACT(DAY FROM ${alias}) = :day AND EXTRACT(MONTH FROM ${alias}) = :month AND EXTRACT(YEAR FROM ${alias}) = :year`,
        { day, month, year },
      );
    }
    if (userId) {
      where['user'] = {
        id: userId,
      };
    }
    if (locationId) {
      where['location'] = {
        id: locationId,
      };
    }
    let purchases = await this.manager.find(Purchase, {
      where,
      relations: {
        user: true,
        location: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    purchases = purchases.map((p) => {
      const purchase = pick(p, [
        'id',
        'code',
        'booksData',
        'notes',
        'createdAt',
        'updatedAt',
        'isDelivery',
        'paidAmount',
        'paymentStatus',
        'paymentReference',
        'user',
        'location',
      ]);
      purchase.user = pick(purchase.user, [
        'email',
        'firstName',
        'lastName',
      ]) as unknown as User;
      purchase.location = pick(purchase.location, [
        'name',
      ]) as unknown as Location;
      return purchase;
    }) as unknown as Purchase[];
    return purchases;
  }

  // find, else create split purchase for (createdAt) this month and year, and return it
  private async getSplitPurchase() {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-11
    const currentYear = new Date().getFullYear();
    let splitPurchase = await this.manager.findOne(SplitPurchase, {
      where: {
        createdAt: Raw(
          (alias) =>
            `EXTRACT(MONTH FROM ${alias}) = :month AND EXTRACT(YEAR FROM ${alias}) = :year`,
          { month: currentMonth, year: currentYear },
        ),
      },
    });
    if (!splitPurchase) {
      splitPurchase = await this.manager.save(SplitPurchase, {
        amount: 0,
      });
    }
    return splitPurchase;
  }

  private async verifyPurchase(reference: string) {
    return new Promise((resolve, reject) => {
      const { PAYMENT_SECRET_KEY } = process.env;
      axios
        .get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${PAYMENT_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log('success');
          // data.status = ongoing, success, abandoned (can still later report as success), failed
          resolve(response.data?.data);
        })
        .catch((error) => {
          console.log(error);
          console.log('error on verify purchase');
          reject(error);
        });
    });
  }

  // TODO: include the gift name if the user used a gift coupon
  // TODO: limit the number of emails sent per cron execution to based on limits of the email provider.

  // verify a purchase
  async verifyPurchasePayment(uniqueCode: string, purchase?: Purchase | null) {
    // check if the purchase exists and is the right type
    if (!purchase || !(purchase instanceof Purchase)) {
      if (!uniqueCode) {
        return throwBadRequest('Purchase not found');
      }
      purchase = await this.manager.findOne(Purchase, {
        where: {
          code: uniqueCode,
        },
        relations: {
          user: true,
          location: true,
        },
      });
    }
    if (!purchase) {
      return throwBadRequest('Purchase not found');
    }
    const finalPrice = Number(purchase.finalPrice);
    const oldPaidAmount = Number(purchase.paidAmount);
    // check if the payment status is pending
    if (purchase.paymentStatus !== PaymentStatusEnum.PENDING) {
      // return throwBadRequest('Payment has already been finalized');
    }
    // verify the purchase
    let isError = false;
    const purchaseData = await this.verifyPurchase(
      purchase.paymentReference,
    ).catch(() => {
      isError = true;
    });
    if (isError) {
      return throwBadRequest('Error verifying payment');
    }
    const { amount, customer, status, fees_split } = purchaseData as {
      amount: number;
      customer: { email: string };
      status: string;
      fees_split: FeesSplit;
    };
    console.log({
      amount,
      customer,
      status,
      fees_split,
    });
    let wasPurchaseUpdated = false;
    if (status === PaymentStatusEnum.SUCCESS) {
      // if the paymentStatus is pending, change it to success and update the paidAmount
      if (purchase.paymentStatus === PaymentStatusEnum.PENDING) {
        const currPaidAmount = Number(divide(Number(amount.toFixed(4)), 100));
        purchase.paidAmount = Number(oldPaidAmount) + Number(currPaidAmount);
        if (purchase.paidAmount >= finalPrice) {
          purchase.paymentStatus = PaymentStatusEnum.SUCCESS;
        }

        await this.sendPurchaseEmails(purchase).catch((err) => {
          console.log('Error sending purchase emails:', err);
        });
        // NOTE: only required for split payments
        // const paidToSelfRaw = Number(fees_split?.integration);
        // if (!isNaN(paidToSelfRaw)) {
        //   const paidToSelf = Number(divide(paidToSelfRaw, 100).toFixed(4));
        //   // update the split purchase
        //   // const splitPurchase = await this.getSplitPurchase();
        //   // splitPurchase.amount = add(Number(splitPurchase.amount), paidToSelf);
        //   // await this.manager.save(SplitPurchase, splitPurchase);
        // }
        wasPurchaseUpdated = true;
      }
    } else if (status === PaymentStatusEnum.FAILED) {
      // if the paymentStatus is pending, change it to failed
      if (purchase.paymentStatus === PaymentStatusEnum.PENDING) {
        purchase.paymentStatus = PaymentStatusEnum.FAILED;
        // increase the book quantities in the database
        for await (const bookData of purchase.booksData) {
          await this.manager
            .createQueryBuilder()
            .update(Book)
            .set({
              amountInStock: () => `"amountInStock" + :quantity`,
            })
            .where({ id: bookData.bookId })
            .setParameter('quantity', bookData.quantity)
            .execute();
        }
        wasPurchaseUpdated = true;
      }
    } else if (status === 'abandoned') {
      // NOTE: abandoned payments can still be reported as success later on
    } else if (status === 'ongoing') {
      // do nothing
    }
    // else {
    // NOTE: what aboout reverted? Most likely not needed.
    // }

    // if the payment status is pending, and 24 hours have passed since the purchase was created, change it to failed
    if (
      purchase.paymentStatus === PaymentStatusEnum.PENDING &&
      purchase.createdAt
    ) {
      const timeDifference =
        Date.now() - new Date(purchase.createdAt).getTime();
      if (timeDifference > 24 * 60 * 60 * 1000) {
        purchase.paymentStatus = PaymentStatusEnum.FAILED;
        // decrease the book quantities in the database
        const bookIds = [
          ...new Set(purchase.booksData.map((book) => toNumber(book.bookId))),
        ];
        const books = await this.manager.find(Book, {
          where: {
            id: In(bookIds),
          },
          select: ['id', 'amountInStock'],
        });
        if (books && books.length) {
          books.forEach((book) => {
            const bookQuantity = toNumber(
              purchase.booksData.find((b) => toNumber(b.bookId) === book.id)
                ?.quantity,
            );
            book.amountInStock += bookQuantity;
          });
          await this.manager.save(Book, books);
        }
        wasPurchaseUpdated = true;
      }
    }
    // update the purchase
    if (wasPurchaseUpdated) {
      await this.manager.save(Purchase, purchase);
    }
    return {
      customerEmail: customer.email,
      status,
      amount: purchase.paidAmount,
      code: uniqueCode,
    };
  }

  private async sendPurchaseEmails(purchase: Purchase) {
    const { SITE_ADMIN_EMAIL, NODE_ENV } = process.env;
    const bookIds = [
      ...new Set(purchase.booksData.map((book) => toNumber(book.bookId))),
    ];
    const books = await this.manager.find(Book, {
      where: {
        id: In(bookIds),
      },
      select: ['id', 'title', 'code'],
      withDeleted: true,
    });
    const purchaseBooksDataItems = books.map((book) => {
      return {
        name: book.title,
        code: book.code,
        quantity: toNumber(
          purchase.booksData.find((b) => toNumber(b.bookId) === book.id)
            ?.quantity,
        ),
      };
    });
    const userName = `${purchase.user?.firstName || ''} ${
      purchase.user?.lastName || ''
    }`.trim();
    // create emails
    const templateToUser = purchaseCompleteTemplate(
      {
        recipient: purchase.user.email,
        subject: 'Booksroundabout Purchase Confirmation',
        data: {
          items: purchaseBooksDataItems,
          notes: purchase.notes,
          userName: userName || '',
          userEmail: purchase.user.email,
          userPhoneNumber: purchase.user.phone,
          isDelivery: purchase.isDelivery,
          deliveryLocation: purchase.location?.name,
          basePrice: purchase.basePrice,
          paidPrice: purchase.paidAmount,
          isDiscountApplied: purchase.isDiscountApplied,
        },
      },
      true,
    );
    const templateToAdmin = purchaseCompleteTemplate(
      {
        recipient: SITE_ADMIN_EMAIL,
        subject: 'Booksroundabout Purchase Confirmation',
        data: {
          items: purchaseBooksDataItems,
          notes: purchase.notes,
          userName: userName || '',
          userEmail: purchase.user.email,
          userPhoneNumber: purchase.user.phone,
          userAddress: purchase.user.address,
          isDelivery: purchase.isDelivery,
          deliveryLocation: purchase.location?.name,
          basePrice: purchase.basePrice,
          paidPrice: purchase.paidAmount,
          isDiscountApplied: purchase.isDiscountApplied,
        },
      },
      false,
    );

    for (const template of [templateToUser, templateToAdmin]) {
      const email = new Email();
      email.type = EmailTypeEnum.PURCHASE;
      email.data = {
        recipient: template.recipient,
        subject: template.subject,
        body: template.body,
      };
      if (NODE_ENV !== 'production') {
        console.log(
          "Sending contact email immediately because we're in dev mode.",
        );
        email.status = EmailStatusEnum.SUCCESS;
        sendMail(template).catch((err) => {
          console.log(err);
        });
      }
      await this.manager.save(email);
    }
  }

  /**
 * finalPrice: 13,000 || 1,300,000
 * {
  fees_split: {
    paystack: 29500, 2.269%
    integration: '130000', // amount that goes to the main account
    subaccount: 1140500, // 87.73%
    params: {
      bearer: 'subaccount',
      transaction_charge: '130000',
      percentage_charge: '10'
    }
  }
}
//
//
if splitPurchase for the month is 399,999.00:
{
  fees_split: {
    paystack: 29500,
    integration: '100',
    subaccount: 1270400,
    params: {
      bearer: 'subaccount',
      transaction_charge: '100',
      percentage_charge: '10'
    }
  }
}


 */

  private async initiatePurchase({
    email,
    amount,
    callbackUrl,
  }: {
    email: string;
    amount: number;
    callbackUrl: string;
  }): Promise<{
    reference: string;
    access_code: string;
    authorization_url: string;
  }> | null {
    // console.log({
    //   email,
    //   amount,
    //   callbackUrl,
    //   // subaccount,
    //   // amountForMainAccount,
    // });
    return new Promise((resolve, reject) => {
      const { PAYMENT_SECRET_KEY } = process.env;
      axios
        .post(
          'https://api.paystack.co/transaction/initialize',
          {
            email: email,
            amount: multiply(amount, 100),
            callback_url: callbackUrl,
            // NOTE: only required for split payments
            // subaccount,
            // bearer: 'subaccount',
            // transaction_charge: multiply(amountForMainAccount, 100),
            // if provided, transaction_charge is the fixed amount that will be sent to the main account
            // regardless of any preset amount.
          },
          {
            headers: {
              Authorization: `Bearer ${PAYMENT_SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => {
          // console.log('success');
          resolve(response.data?.data);
        })
        .catch((error) => {
          console.log(error);
          console.log('error on initiate purchase');
          reject(error);
        });
    });
  }

  // create a purchase
  async createPurchase(data: NewPurchaseDto, userId: number) {
    await this.checkIfPurchasesAreEnabled();
    // const {
    //   SUBACCOUNT_CODE,
    //   SELF_PAYMENT_MONTHLY_MAX_AMOUNT: selfPaymentMonthlyMaxAmount_,
    //   SELF_PAYMENT_PERCENTAGE: selfPaymentPercentage_,
    // } = process.env;
    // const selfPaymentMonthlyMaxAmount = Number(selfPaymentMonthlyMaxAmount_);
    // const selfPaymentPercentage = Number(selfPaymentPercentage_);
    // ensure that the user exists.
    const user = await this.manager.findOne(User, {
      where: {
        id: userId,
      },
      select: ['id', 'email'],
      relations: ['purchases'],
    });
    if (!user) {
      return throwBadRequest('User not found');
    }
    if (!user.email) {
      return throwBadRequest('User email not found');
    }
    // if they want the books to be delivered, their location must be available in the database
    let location;
    if (data.deliveryType === DeliveryTypeEnum.DELIVERY) {
      location = await this.manager.findOne(Location, {
        where: {
          id: toNumber(data.locationId),
        },
        relations: ['purchases'],
      });
      if (!location) {
        return throwBadRequest('The location you provided is invalid');
      }
    }
    // calculate the price of the books
    const { data: booksData, finalPrice } = await this.calculateBooksPrice(
      data,
      userId,
    );

    let isError = false;
    const uniqueCode = generateRandomString(12);

    // NOTE: only required for split payments
    // const splitPurchase = await this.getSplitPurchase();
    // const splitPurchaseAmount = Number(splitPurchase.amount);
    // let amountForMainAccount = Number(
    //   multiply(finalPrice, selfPaymentPercentage / 100).toFixed(4),
    // ); // if selfPaymentPercentage is 5, then amountForMainAccount is 5% of the final price
    // if (splitPurchaseAmount + finalPrice > selfPaymentMonthlyMaxAmount) {
    //   amountForMainAccount = max([
    //     subtract(selfPaymentMonthlyMaxAmount, splitPurchaseAmount),
    //     0,
    //   ]);
    // }

    const purchaseData = await this.initiatePurchase({
      email: user.email,
      amount: finalPrice,
      callbackUrl: `${data.callbackUrl}?code=${uniqueCode}`,
      // subaccount: SUBACCOUNT_CODE,
      // amountForMainAccount,
    }).catch((error) => {
      isError = true;
      return throwBadRequest(error);
    });
    if (isError) return;
    if (!purchaseData) {
      return throwBadRequest('Error initiating payment');
    }
    const { reference, access_code, authorization_url } = purchaseData as {
      reference: string;
      access_code: string;
      authorization_url: string;
    };
    // next, reduce the book quantities in the database
    const bookIds = booksData.bookIds;
    const books = await this.manager.find(Book, {
      where: {
        id: In(bookIds),
      },
      select: ['id', 'amountInStock'],
    });
    if (books && books.length) {
      books.forEach((book) => {
        const bookQuantity = toNumber(
          data.books.find((b) => toNumber(b.bookId) === book.id)?.quantity,
        );
        book.amountInStock -= bookQuantity;
      });
      await this.manager.save(Book, books);
    }

    // create the purchase
    const purchase = {
      user,
      // NOTE: only required for split payments
      // ...(amountForMainAccount > 0 && { splitPurchase }),
      code: uniqueCode,
      booksData: data.books.map((book) => ({
        bookId: toNumber(book.bookId),
        quantity: toNumber(book.quantity),
      })),
      notes: data.notes,
      isDelivery: booksData.isDelivery,
      deliveryPrice: booksData.deliveryPrice,
      basePrice: booksData.totalBooksBasePrice,
      isDiscountApplied: booksData.isDiscountApplied,
      finalPrice,
      paymentStatus: PaymentStatusEnum.PENDING,
      paymentReference: reference,
      paymentAccessCode: access_code,
    };
    const createdPurchase = await this.manager.save(Purchase, purchase);
    // add the purchase to the location if it exists
    if (location) {
      location.purchases.push(createdPurchase);
      await this.manager.save(Location, location);
    }
    return {
      data: booksData,
      finalPrice,
      purchaseUrl: authorization_url,
      code: uniqueCode,
      status: PaymentStatusEnum.PENDING,
    };
  }

  private async calculateBooksPrice(
    data: CalculatePurchaseDto,
    userId?: number,
  ) {
    let promo: {
      type: DiscountTypeEnum;
      value: number;
      category: DiscountCategoryEnum;
      couponType?: CouponTypeEnum | null;
      couponMinValue?: number | null;
    };
    let globalDiscounts: Discount[] | null = null;
    const initialBooksQuantity = data.books.length;
    // remove duplicates from the books array
    data.books = data.books.filter(
      (book, index, self) =>
        self.findIndex((b) => b.bookId === book.bookId) === index,
    );
    if (initialBooksQuantity !== data.books.length) {
      return throwBadRequest('Duplicate books found');
    }
    // filter out books with a quantity of 0 or less
    data.books = data.books.filter((book) => toNumber(book.quantity) > 0);
    if (initialBooksQuantity !== data.books.length) {
      return throwBadRequest('Some books have a quantity of 0 or less');
    }
    let booksOnSaleCount = 0,
      isDiscountApplied = false;

    if (data.couponCode) {
      // first, check if a coupon is applied
      const discount = await this.manager.findOne(Discount, {
        where: {
          couponCode: data.couponCode,
          // applies for: gift, free shipping and coupon
          category: In([
            DiscountCategoryEnum.GIFT,
            DiscountCategoryEnum.FREE_SHIPPING,
            DiscountCategoryEnum.COUPON,
          ]),
        },
        select: [
          'type',
          'value',
          'couponType',
          'couponMinValue',
          'isActive',
          'category',
        ],
      });
      if (!discount) {
        return throwBadRequest('Coupon not found');
      }
      // check if the coupon is active
      if (!discount.isActive) {
        return throwBadRequest('That coupon is not active right now');
      }
      promo = {
        type: discount.type,
        value: discount.value,
        category: discount.category,
        couponType: discount.couponType,
        couponMinValue: discount.couponMinValue,
      };
    } else {
      // get all global discounts
      globalDiscounts = await this.manager.find(Discount, {
        where: {
          category: DiscountCategoryEnum.GLOBAL,
          isActive: true,
          couponType: CouponTypeEnum.MINIMUM_PRICE,
          // NOTE: Only supports minimum price for global discounts for now
        },
        select: ['type', 'value', 'couponType', 'couponMinValue'],
      });
    }

    // get the books
    const bookIds = data.books.map((book) => toNumber(book.bookId));
    const books = await this.manager.find(Book, {
      where: {
        id: In(bookIds),
      },
      select: {
        title: true,
        id: true,
        code: true,
        amountInStock: true,
        price: true,
        discountPrice: true,
      },
    });
    if (!books || books.length != data.books.length) {
      return throwBadRequest('Some of the books provided are invalid');
    }
    // check that the books are in stock, if not, throw an error saying which books are not in stock
    const booksNotInStock = books.filter(
      (book) =>
        book.amountInStock <
        toNumber(
          data.books.find((b) => toNumber(b.bookId) === book.id)?.quantity,
        ),
    );
    if (booksNotInStock.length) {
      return throwBadRequest(
        `Your purchase exceeds our available stock of the following books: ${booksNotInStock
          .map((book) => book.title)
          .join(', ')}`,
      );
    }
    booksOnSaleCount = books.filter((book) => book.discountPrice).length;
    // calculate the total price of the books. use the discount price if it exists, otherwise use the regular price
    let booksPrice = books.reduce(
      (acc, book) =>
        acc +
        toNumber(
          data.books.find((b) => toNumber(b.bookId) === book.id)?.quantity,
        ) *
          (toNumber(book.discountPrice) || toNumber(book.price)),
      0,
    );
    let finalPrice = booksPrice;
    // apply the selected coupon if it exists and is in the coupon category
    if (promo && promo.category === DiscountCategoryEnum.COUPON) {
      if (promo.couponType === CouponTypeEnum.MINIMUM_PRICE) {
        if (booksPrice < promo.couponMinValue) {
          return throwBadRequest(
            `You need to spend at least ${promo.couponMinValue} to use this coupon`,
          );
        }
      } else if (promo.couponType === CouponTypeEnum.MINIMUM_QUANTITY) {
        if (data.books.length < promo.couponMinValue) {
          return throwBadRequest(
            `You need to purchase at least ${promo.couponMinValue} books to use this coupon`,
          );
        }
      }
      if (promo.type === DiscountTypeEnum.PERCENTAGE) {
        finalPrice = booksPrice - (booksPrice * promo.value) / 100;
      } else if (promo.type === DiscountTypeEnum.FIXED) {
        finalPrice = booksPrice - promo.value;
      }
      isDiscountApplied = true;
    }
    // apply the global discount if it exists and the user qualifies for it
    if (globalDiscounts?.length) {
      // find the discount with the highest couponMinValue that is less than the total price
      const discount = globalDiscounts
        .sort((a, b) => b.couponMinValue - a.couponMinValue)
        .find((d) => booksPrice >= d.couponMinValue);
      // ^ this works by sorting the discounts by couponMinValue in descending order, then finding the first discount that is less than the total price
      if (discount) {
        if (discount.type === DiscountTypeEnum.PERCENTAGE) {
          finalPrice = booksPrice - (booksPrice * discount.value) / 100;
        } else if (discount.type === DiscountTypeEnum.FIXED) {
          finalPrice = booksPrice - discount.value;
        }
        isDiscountApplied = true;
      }
    }

    // apply the delivery fee if needed
    let deliveryPrice = 0;
    let deliveryLocationName = null;
    let user: User;
    if (data.deliveryType === DeliveryTypeEnum.DELIVERY) {
      const location = await this.manager.findOne(Location, {
        where: {
          id: toNumber(data.locationId),
        },
        select: ['price', 'name'],
      });
      if (!location) {
        return throwBadRequest('The location you provided is invalid');
      }
      deliveryLocationName = location.name;
      // ensure the user has an address and phone number in order to use delivery
      user = await this.manager.findOne(User, {
        where: {
          id: userId,
        },
        select: [
          'address',
          'state',
          'town',
          'country',
          'phone',
          'email',
          'firstName',
          'lastName',
        ],
      });
      if (!user || !userId) {
        return throwBadRequest('User not found');
      }
      if (
        !(user.address && user.state && user.town && user.country && user.phone)
      ) {
        return throwBadRequest(
          'You need to provide your address, state, town, country and phone number to use the delivery option',
        );
      }
      // dont add the delivery fee if the user has a free shipping coupon
      if (!(promo && promo.category === DiscountCategoryEnum.FREE_SHIPPING)) {
        deliveryPrice = toNumber(location.price);
        finalPrice += deliveryPrice;
      }
    } else if (data.deliveryType === DeliveryTypeEnum.PICKUP) {
      // ensure the user has a phone number in order to use pickup
      user = await this.manager.findOne(User, {
        where: {
          id: userId,
        },
        select: ['phone', 'email', 'firstName', 'lastName'],
      });
      if (!user || !userId) {
        return throwBadRequest('User not found');
      }
      if (!user.phone && !user.email) {
        return throwBadRequest(
          'You need to provide your email and phone number to use the pickup option',
        );
      }
    } else {
      return throwBadRequest('Invalid delivery type');
    }

    // convert all those prices to no more than 4 decimal places
    deliveryPrice = Number(deliveryPrice.toFixed(4));
    booksPrice = Number(booksPrice.toFixed(4));
    finalPrice = Number(finalPrice.toFixed(4));
    // ensure that delivery price, books price and final price are all numbers
    // greater than 0 and less than 100 million
    if (
      !(
        deliveryPrice >= 0 &&
        deliveryPrice < 100_000_000 &&
        booksPrice > 0 &&
        booksPrice < 100_000_000 &&
        finalPrice > 0 &&
        finalPrice < 100_000_000
      )
    ) {
      return throwBadRequest('Invalid price');
    }
    // if any of the prices are NaN, throw an error
    if (isNaN(deliveryPrice) || isNaN(booksPrice) || isNaN(finalPrice)) {
      return throwBadRequest('Invalid price');
    }

    return {
      data: {
        bookIds,
        books: books.map((book) => pick(book, ['id', 'title', 'code'])),
        user: pick(user, ['firstName', 'lastName', 'email', 'phone']),
        totalBookCopiesCount: data.books.reduce(
          (acc, book) => acc + toNumber(book.quantity),
          0,
        ),
        totalBooksBasePrice: booksPrice,
        isDiscountApplied,
        booksOnSaleCount,
        isDelivery: data.deliveryType === DeliveryTypeEnum.DELIVERY,
        deliveryLocation: deliveryLocationName,
        deliveryPrice,
      },
      finalPrice,
    };
  }

  // Calculate the price of the purchase
  async calculatePurchase(data: CalculatePurchaseDto, userId: number) {
    // ensure that the user exists.
    const user = await this.manager.findOne(User, {
      where: {
        id: userId,
      },
      select: ['id', 'email'],
    });
    if (!user) {
      return throwBadRequest('User not found');
    }
    if (!user.email) {
      return throwBadRequest('User email not found');
    }
    // calculate the price of the books
    return this.calculateBooksPrice(data, userId);
  }
}
