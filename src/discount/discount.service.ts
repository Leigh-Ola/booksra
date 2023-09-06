import { Injectable } from '@nestjs/common';
import { ILike, In, EntityManager, DataSource } from 'typeorm';
import { Discount } from './discount.entity';
import { Book } from '../books/book.entity';
import { CreateDiscountDto } from './dto/discount-dto';
import { DiscountTypeEnum } from '../utils/types';
import { pick } from 'lodash';
import { throwBadRequest } from '../utils/helpers';

@Injectable()
export class DiscountService {
  manager: EntityManager;
  constructor(private dbSource: DataSource) {
    this.manager = this.dbSource.manager;
  }

  private async isDatePassed(date: Date, compareDate: Date) {
    return date.getTime() <= compareDate.getTime();
  }

  // create discount
  async create(discountDto: CreateDiscountDto) {
    // pick the required fields
    discountDto = pick(discountDto, [
      'name',
      'couponCode',
      'type',
      'value',
      'startDate',
      'endDate',
      'bookIds',
    ]);
    // if the discount is percentage, the value should be between 0 and 100
    if (
      discountDto.type === DiscountTypeEnum.PERCENTAGE &&
      (discountDto.value < 0 || discountDto.value > 100)
    ) {
      throwBadRequest(
        'For percentage discounts, the value should be between 0 and 100',
      );
    }
    // if the discount is fixed, the value should be greater than 0
    if (discountDto.type === DiscountTypeEnum.FIXED && discountDto.value <= 0) {
      throwBadRequest(
        'For fixed discounts, the value should be greater than 0',
      );
    }
    // if the end date has passed, throw an error
    if (await this.isDatePassed(new Date(discountDto.endDate), new Date())) {
      throwBadRequest('The end date has passed');
    }
    // if the coupon code already exists (exact match), throw an error
    if (discountDto.couponCode) {
      const existingDiscount = await this.manager.findOne(Discount, {
        where: {
          couponCode: String(discountDto.couponCode).toLowerCase(),
        },
      });
      if (existingDiscount) {
        throwBadRequest('This coupon code already exists');
      }
    }
    const discount = discountDto as CreateDiscountDto & {
      isActive: boolean;
      books: Book[];
    };
    // if the start date has passed, set the isActive to true
    if (await this.isDatePassed(new Date(discountDto.startDate), new Date())) {
      discount.isActive = true;
    } else {
      discount.isActive = false;
    }
    // validate books
    const foundBooks = await this.manager.find(Book, {
      where: {
        id: In(discountDto.bookIds),
      },
      relations: ['discount'],
    });
    if (foundBooks.length !== discountDto.bookIds.length) {
      throwBadRequest(
        discount.bookIds.length -
          foundBooks.length +
          ' book(s) you selected were not found',
      );
    }
    // if any of the books already have a discount, throw an error
    const booksWithDiscount = foundBooks.filter((book) => book.discount);
    if (booksWithDiscount.length) {
      throwBadRequest(
        'Unable to proceed. The following books already have a discount: ' +
          booksWithDiscount.map((book) => book.code).join(', '),
      );
    }
    discount.books = foundBooks;
    // create discount
    const newDiscount = await this.manager.create(
      Discount,
      discount as unknown as Discount,
    );
    const createdDiscount = await this.manager.save(newDiscount);
    // update books
    await this.updateBooks(discountDto.bookIds, createdDiscount);
  }

  // ensure books exist, and update their discounts
  private async updateBooks(
    bookIds: number[],
    discount: { id: number; value: number; type: DiscountTypeEnum },
  ) {
    // update books
    const bookIdsStr = bookIds.join(', ');
    const discountExpression =
      discount.type === DiscountTypeEnum.PERCENTAGE
        ? `GREATEST(price - (price * ${discount.value} / 100), 0)`
        : `GREATEST(price - ${discount.value}, 0)`;

    await this.manager.query(`
        UPDATE "book"
        SET "discountId" = ${discount.id}, "discountPrice" = ${discountExpression}
        WHERE "id" IN (${bookIdsStr})
      `);
  }

  // find discounts
  async find(
    {
      page,
      limit,
      query,
    }: {
      page: number;
      limit: number;
      query: string;
    } = { page: 1, limit: 10, query: '' },
  ) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 1 : limit > 100 ? 100 : limit;
    if (!query) {
      return await this.manager.find(Discount, {
        take: limit,
        skip: (page - 1) * limit,
      });
    }
    const discounts = await this.manager.find(Discount, {
      where: [{ name: ILike(`%${query}%`) }, { couponCode: query }],
      relations: ['books'],
      take: limit,
      skip: (page - 1) * limit,
    });
    return discounts.map((discount) => {
      discount.books = discount.books?.map((book) => {
        return {
          id: book.id,
          code: book.code,
          title: book.title,
          imageUrl: book.imageUrl,
        };
      }) as unknown as Book[];
      return discount;
    });
  }

  // delete discount
  async delete(id: number) {
    const discount = await this.manager.findOne(Discount, {
      where: {
        id,
      },
    });
    if (!discount) {
      throwBadRequest('Discount not found');
    }
    await this.manager.delete(Discount, id);
    // update books
    await this.manager.update(
      Book,
      { discountId: id },
      { discountId: null, discountPrice: null },
    );
  }
}
