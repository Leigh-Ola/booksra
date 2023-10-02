import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource, In, MoreThan } from 'typeorm';
import { throwBadRequest } from '../utils/helpers';
import { CalculatePurchaseDto } from './dto/purchases.dto';
import { Book } from '../books/book.entity';
import { Discount } from '../discount/discount.entity';
import { Location } from '../location/location.entity';
import { toNumber } from 'lodash';
import {
  DiscountTypeEnum,
  DiscountCategoryEnum,
  DeliveryTypeEnum,
  CouponTypeEnum,
} from '../utils/types';

@Injectable()
export class PurchasesService {
  manager: EntityManager;
  constructor(private dbSource: DataSource) {
    this.manager = this.dbSource.manager;
  }

  // Calculate the price of the purchase
  async calculatePurchase(data: CalculatePurchaseDto, userId: string) {
    // ensure that the user exists.
    const user = await this.manager.findOne('User', {
      where: {
        id: userId,
      },
      select: ['id'],
    });
    if (!user) {
      throwBadRequest('User not found');
    }
    // calculate the price of the books
    return this.calculateBooksPrice(data);
  }

  async createPurchase(data: CalculatePurchaseDto, userId: string) {
    // ensure that the user exists.
    const user = await this.manager.findOne('User', {
      where: {
        id: userId,
      },
      select: ['id'],
    });
    if (!user) {
      throwBadRequest('User not found');
    }
    // // calculate the price of the books
    // const { data: booksData, finalPrice } =
    //   await this.calculateBooksPrice(data);
    // // create the purchase
    // const purchase = await this.manager.save('Purchase', {
    //   userId,
    //   totalPrice: finalPrice,
    //   notes: data.notes,
    //   calculatedPriceData: booksData,
    //   booksData: data.books,
    // });
    // // create the purchase books

    // initialize the purchase via paystack

    return;
  }

  private async calculateBooksPrice(data: CalculatePurchaseDto) {
    let promo: {
      type: DiscountTypeEnum;
      value: number;
      couponType?: CouponTypeEnum | null;
      couponMinValue?: number | null;
    };
    let globalDiscounts: Discount[] | null = null;
    // remove duplicates from the books array
    data.books = data.books.filter(
      (book, index, self) =>
        self.findIndex((b) => b.bookId === book.bookId) === index,
    );
    // filter out books with a quantity of 0 or less
    data.books = data.books.filter((book) => toNumber(book.quantity) > 0);
    let booksOnSaleCount = 0,
      isDiscountApplied = false;

    if (data.couponCode) {
      // first, check if a coupon is applied
      const discount = await this.manager.findOne(Discount, {
        where: {
          couponCode: data.couponCode,
          category: DiscountCategoryEnum.COUPON,
        },
        select: ['type', 'value', 'couponType', 'couponMinValue', 'isActive'],
      });
      if (!discount) {
        throwBadRequest('Coupon not found');
      }
      // check if the coupon is active
      if (!discount.isActive) {
        throwBadRequest('That coupon is not active right now');
      }
      promo = {
        type: discount.type,
        value: discount.value,
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
    const booksPrice = books.reduce(
      (acc, book) =>
        acc +
        toNumber(
          data.books.find((b) => toNumber(b.bookId) === book.id)?.quantity,
        ) *
          (toNumber(book.discountPrice) || toNumber(book.price)),
      0,
    );
    let finalPrice = booksPrice;
    // apply the selected coupon if it exists
    if (promo) {
      if (promo.couponType === CouponTypeEnum.MINIMUM_PRICE) {
        if (booksPrice < promo.couponMinValue) {
          throwBadRequest(
            `You need to spend at least ${promo.couponMinValue} to use this coupon`,
          );
        }
      } else if (promo.couponType === CouponTypeEnum.MINIMUM_QUANTITY) {
        if (data.books.length < promo.couponMinValue) {
          throwBadRequest(
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
    } else if (globalDiscounts?.length) {
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
    if (data.deliveryType === DeliveryTypeEnum.DELIVERY) {
      const location = await this.manager.findOne(Location, {
        where: {
          id: toNumber(data.locationId),
        },
        select: ['price'],
      });
      if (!location) {
        throwBadRequest('The location you provided is invalid');
      }
      deliveryPrice = toNumber(location.price);
      finalPrice += deliveryPrice;
    }

    return {
      data: {
        bookIds,
        totalBookCopiesCount: data.books.reduce(
          (acc, book) => acc + toNumber(book.quantity),
          0,
        ),
        totalBooksBasePrice: booksPrice,
        isDiscountApplied,
        booksOnSaleCount,
        isDelivery: data.deliveryType === DeliveryTypeEnum.DELIVERY,
        deliveryPrice,
      },
      finalPrice,
    };
  }
}
