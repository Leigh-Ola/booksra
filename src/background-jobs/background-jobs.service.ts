import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource, Raw } from 'typeorm';
import { throwBadRequest } from '../utils/helpers';
import { Book } from '../books/book.entity';
import { Discount } from '../discount/discount.entity';

@Injectable()
export class BackgroundJobsService {
  manager: EntityManager;
  constructor(private dbSource: DataSource) {
    this.manager = this.dbSource.manager;
  }

  // send Email
  async deleteOldBooks(code) {
    const { BACKGROUND_JOB_CODE, ALLOW_BACKGROUND_JOBS } = process.env;
    if (ALLOW_BACKGROUND_JOBS !== 'true') {
      return throwBadRequest('Background jobs not allowed');
    }
    if (code !== BACKGROUND_JOB_CODE) {
      return throwBadRequest('Invalid code');
    }

    const books = await this.manager.find(Book, {
      where: {
        amountInStock: 0,
        updatedAt: Raw((alias) => `${alias} < NOW() - INTERVAL '30 days'`),
      },
      withDeleted: true,
    });

    if (!books?.length) {
      return;
    }

    // delete the books
    await this.manager.remove(books);
  }

  // update isActve for discounts
  async updateDiscountStatuses(code) {
    const { BACKGROUND_JOB_CODE, ALLOW_BACKGROUND_JOBS } = process.env;
    if (ALLOW_BACKGROUND_JOBS !== 'true') {
      return throwBadRequest('Background jobs not allowed');
    }
    if (code !== BACKGROUND_JOB_CODE) {
      return throwBadRequest('Invalid code');
    }

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
}
