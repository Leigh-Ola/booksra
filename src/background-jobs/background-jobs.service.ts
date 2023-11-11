import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource, Raw, LessThan, Any } from 'typeorm';
import { throwBadRequest } from '../utils/helpers';
import { Book } from '../books/book.entity';
import { Discount } from '../discount/discount.entity';
import { Purchase } from '../purchases/purchase.entity';
import { Email } from '../misc/email.entity';
import { PurchasesService } from '../purchases/purchases.service';
import { PaymentStatusEnum, EmailStatusEnum } from '../utils/types';
import { sendMail } from '../mail/mail.service';

@Injectable()
export class BackgroundJobsService {
  manager: EntityManager;
  constructor(
    private dbSource: DataSource,
    private purchasesService: PurchasesService,
  ) {
    this.manager = this.dbSource.manager;
  }

  async validateCronCode(code) {
    const { BACKGROUND_JOB_CODE, ALLOW_BACKGROUND_JOBS } = process.env;
    if (String(ALLOW_BACKGROUND_JOBS) !== 'true') {
      return throwBadRequest('Background jobs not allowed');
    }
    if (code !== String(BACKGROUND_JOB_CODE)) {
      return throwBadRequest('Invalid code');
    }
  }

  // delete books that havent been updated in 30 days and (have no stock OR are soft-deleted)
  async deleteOldBooks() {
    let books = await this.manager.find(Book, {
      where: {
        updatedAt: Raw((alias) => `${alias} < NOW() - INTERVAL '30 days'`),
      },
      select: {
        amountInStock: true,
        deletedAt: true,
        id: true,
      },
      withDeleted: true,
    });

    if (!books?.length) {
      return;
    }

    books = books.filter(
      (book) => book.amountInStock === 0 || book.deletedAt !== null,
    );
    // boo

    // delete the books
    await this.manager.remove(books);
  }

  // update isActve for discounts based on their start and end dates and their current status
  async updateDiscountStatuses() {
    const discounts = await this.manager.find(Discount);

    if (!discounts?.length) {
      return;
    }

    const today = new Date();
    // find the discounts that are not active but their start date is has passed and their end date has not passed
    const discountsToActivate = discounts.filter(
      (discount) =>
        !discount.isActive &&
        discount.startDate <= today &&
        discount.endDate >= today,
    );
    // find the discounts that are active but their end date has passed
    const discountsToDeactivate = discounts.filter(
      (discount) => discount.isActive && discount.endDate < today,
    );

    // update the discounts
    discountsToActivate.forEach((discount) => {
      discount.isActive = true;
    });
    discountsToDeactivate.forEach((discount) => {
      discount.isActive = false;
    });

    // save the discounts
    await this.manager.save(Discount, [
      ...discountsToActivate,
      ...discountsToDeactivate,
    ]);
  }

  // check payment statuses
  async checkPaymentStatuses() {
    // delete the purchases that are older than 7 days and have not been paid
    const purchasesToDelete = await this.manager.find(Purchase, {
      where: {
        paymentStatus: PaymentStatusEnum.PENDING,
        updatedAt: Raw((alias) => `${alias} < NOW() - INTERVAL '7 days'`),
      },
    });
    if (purchasesToDelete?.length) {
      await this.manager.remove(purchasesToDelete);
    }
    // find pending purchases less than 3 days old.
    let purchases = await this.manager.find(Purchase, {
      where: {
        paymentStatus: PaymentStatusEnum.PENDING,
        updatedAt: Raw((alias) => `${alias} > NOW() - INTERVAL '3 days'`),
      },
      // sorted from newest to oldest
      order: {
        updatedAt: 'DESC',
      },
      // limit to 20 purchases
      take: 20,
    });
    if (!purchases?.length) {
      return;
    }
    // reverse the order of the purchases so that the oldest is first
    purchases = purchases.reverse();
    // check the payment status for each purchase using the purchasesService.verifyPurchasePayment
    for await (const purchase of purchases) {
      await this.purchasesService
        .verifyPurchasePayment(null, purchase)
        .catch((err) => {});
    }
  }

  // send Emails
  async sendEmails() {
    // find all emails that have not been sent
    const emails = await this.manager.find(Email, {
      where: {
        // failed or pending
        status: Any([EmailStatusEnum.FAILED, EmailStatusEnum.PENDING]),
        // less than 5 tries
        tries: LessThan(5),
      },
      take: 30,
    });
    if (!emails?.length) {
      return;
    }
    // send each email
    for await (const email of emails) {
      await sendMail(email.data)
        .then(() => {
          email.status = EmailStatusEnum.SUCCESS;
        })
        .catch(() => {
          email.status = EmailStatusEnum.FAILED;
        })
        .finally(() => {
          email.tries += 1;
        });
    }
    // save the emails
    this.manager.save(Email, emails);
  }
}
