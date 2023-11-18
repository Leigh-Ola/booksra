import { Injectable } from '@nestjs/common';
import { ILike, In, EntityManager, DataSource } from 'typeorm';
import { Discount } from './discount.entity';
import { Book } from '../books/book.entity';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount-dto';
import {
  DiscountTypeEnum,
  DiscountCategoryEnum,
  CouponTypeEnum,
} from '../utils/types';
import { pick, merge, xor, xorBy } from 'lodash';
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
      'couponType',
      'couponMinValue',
      'category',
    ]);
    // if the discount is percentage, the value should be between 0 and 100
    if (
      discountDto.type === DiscountTypeEnum.PERCENTAGE &&
      (discountDto.value < 0 || discountDto.value > 100)
    ) {
      return throwBadRequest(
        'For percentage discounts, the value should be between 0 and 100',
      );
    }
    // if the discount is fixed, the value should be greater than 0
    if (discountDto.type === DiscountTypeEnum.FIXED && discountDto.value <= 0) {
      return throwBadRequest(
        'For fixed discounts, the value should be greater than 0',
      );
    }
    // if the end date has passed, throw an error
    if (await this.isDatePassed(new Date(discountDto.endDate), new Date())) {
      return throwBadRequest('The end date has passed');
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

    // Validate General Discount
    if (discountDto.category === DiscountCategoryEnum.GENERAL) {
      // validate books
      if (!discountDto.bookIds?.length) {
        return throwBadRequest('Book IDs are required for general discounts');
      }
      const foundBooks = await this.manager.find(Book, {
        where: {
          id: In(discountDto.bookIds),
        },
        select: ['id', 'code', 'title', 'discount'],
        relations: ['discount'],
        withDeleted: true,
      });
      const notFoundBooks = xorBy(
        discountDto.bookIds,
        foundBooks.map((book) => book.id),
      );
      if (foundBooks.length !== discountDto.bookIds.length) {
        return throwBadRequest(
          `${
            notFoundBooks.length
          } book(s) you selected were not found: ${notFoundBooks.join(', ')}`,
        );
      }
      // if any of the books already have a discount, throw an error
      const booksWithDiscount = foundBooks.filter((book) => book.discount);
      if (booksWithDiscount.length) {
        return throwBadRequest(
          'Unable to proceed. The following books already have another discount: ' +
            booksWithDiscount
              .map((book) => {
                return `${book.id} (${book.title})`;
              })
              .join(', '),
        );
      }
      discount.books = foundBooks;
    }
    // Validate Coupon Discount
    else if (
      discountDto.category === DiscountCategoryEnum.COUPON ||
      discountDto.category === DiscountCategoryEnum.FREE_SHIPPING
    ) {
      if (
        !discountDto.couponType ||
        !discountDto.couponMinValue ||
        !discountDto.couponCode
      ) {
        return throwBadRequest(
          'Coupon type, coupon min value and coupon code are required for coupon discounts',
        );
      }
      if (
        typeof discountDto.couponMinValue !== 'number' ||
        discountDto.couponMinValue < 0
      ) {
        return throwBadRequest('Coupon min value should not be less than 0');
      }
      // if the coupon code already exists (exact match), throw an error
      const existingDiscount = await this.manager.findOne(Discount, {
        where: {
          couponCode: String(discountDto.couponCode).toLowerCase(),
        },
      });
      if (existingDiscount) {
        return throwBadRequest('This coupon code already exists');
      } else {
        discount.couponCode = String(discountDto.couponCode).toLowerCase();
      }
    }
    // validate global discount
    else if (discountDto.category === DiscountCategoryEnum.GLOBAL) {
      // if the discount is global, the coupon type and coupon min value should be null
      if (discountDto.couponType) {
        return throwBadRequest(
          'Coupon type should be null for global discounts',
        );
      }
      // set the coupon type to minimum price
      discount.couponType = CouponTypeEnum.MINIMUM_PRICE;
    }
    // create discount
    const newDiscount = await this.manager.create(
      Discount,
      discount as unknown as Discount,
    );
    const createdDiscount = await this.manager.save(newDiscount);
    // update books if the discount category is general
    if (discountDto.category === DiscountCategoryEnum.GENERAL) {
      await this.updateBooksInDiscount(discountDto.bookIds, createdDiscount);
    }
  }

  async update(id: number, discountDto: UpdateDiscountDto) {
    if (!id || isNaN(id)) {
      return throwBadRequest('Discount ID is required');
    }
    const discountExists = await this.manager.findOne(Discount, {
      where: {
        id,
      },
      select: ['id', 'category', 'books'],
      relations: ['books'],
    });
    if (!discountExists) {
      return throwBadRequest('Discount not found');
    }
    // pick the required fields
    discountDto = pick(discountDto, [
      'name',
      'couponCode',
      'type',
      'value',
      'startDate',
      'endDate',
      'bookIds',
      'couponType',
      'couponMinValue',
      'category',
    ]);
    // if the discount is percentage, the value should be between 0 and 100
    if (
      discountDto.type === DiscountTypeEnum.PERCENTAGE &&
      (discountDto.value < 0 || discountDto.value > 100)
    ) {
      return throwBadRequest(
        'For percentage discounts, the value should be between 0 and 100',
      );
    }
    // if the discount is fixed, the value should be greater than 0
    if (discountDto.type === DiscountTypeEnum.FIXED && discountDto.value <= 0) {
      return throwBadRequest(
        'For fixed discounts, the value should be greater than 0',
      );
    }
    // if the end date has passed, throw an error
    if (await this.isDatePassed(new Date(discountDto.endDate), new Date())) {
      return throwBadRequest('The end date has passed');
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

    // Validate General Discount
    let removedBookIds = [];
    if (discountExists.category === DiscountCategoryEnum.GENERAL) {
      // validate books
      if (discountDto.bookIds?.length) {
        const foundBooks = await this.manager.find(Book, {
          where: {
            id: In(discountDto.bookIds),
          },
          select: ['id', 'code', 'title', 'discount'],
          relations: ['discount'],
          withDeleted: true,
        });
        const notFoundBooks = xorBy(
          discountDto.bookIds,
          foundBooks.map((book) => book.id),
        );
        if (foundBooks.length !== discountDto.bookIds.length) {
          return throwBadRequest(
            `${
              notFoundBooks.length
            } book(s) you selected were not found: ${notFoundBooks.join(', ')}`,
          );
        }
        // if any of the books already have another discount, throw an error
        const booksWithDiscount = foundBooks.filter(
          (book) => book.discount && book.discount.id !== id,
        );
        if (booksWithDiscount.length) {
          return throwBadRequest(
            'Unable to proceed. The following books already have another discount: ' +
              booksWithDiscount
                .map((book) => {
                  return `${book.id} (${book.title})`;
                })
                .join(', '),
          );
        }
        // add the books that were removed
        removedBookIds = discountExists.books
          .filter((book) => !foundBooks.find((b) => b.id === book.id))
          .map((book) => book.id);
        discount.books = foundBooks;
      }
    }
    // Validate Coupon Discount
    else if (
      discountExists.category === DiscountCategoryEnum.COUPON ||
      discountExists.category === DiscountCategoryEnum.FREE_SHIPPING
    ) {
      // coupon type doesn't need to be validated
      // coupon min value should be greater than 0
      if (
        discountDto.couponMinValue &&
        (typeof discountDto.couponMinValue !== 'number' ||
          discountDto.couponMinValue < 0)
      ) {
        return throwBadRequest('Coupon min value should not be less than 0');
      }
      // if the coupon code already exists (exact match), throw an error
      if (discountDto.couponCode) {
        const existingDiscount = await this.manager.findOne(Discount, {
          where: {
            couponCode: String(discountDto.couponCode).toLowerCase(),
          },
        });
        if (existingDiscount && existingDiscount.id !== id) {
          return throwBadRequest('This coupon code already exists');
        } else {
          discount.couponCode = String(discountDto.couponCode).toLowerCase();
        }
      }
    }
    // validate global discount
    else if (discountExists.category === DiscountCategoryEnum.GLOBAL) {
      // if the discount is global, the coupon type and coupon min value should be null
      if (discountDto.couponType) {
        return throwBadRequest(
          'You cannot change the coupon type for global discounts',
        );
      }
    }
    // create discount
    const updatedDiscount = merge(discountExists, discount);

    await this.manager.save(updatedDiscount);
    // update books if the discount category is general
    if (discountExists.category === DiscountCategoryEnum.GENERAL) {
      await this.removeBooksFromDiscount(removedBookIds);
      await this.updateBooksInDiscount(discountDto.bookIds, updatedDiscount);
    }
  }

  // ensure books exist, and update their discounts
  private async updateBooksInDiscount(
    bookIds: number[],
    discount: { id: number; value: number; type: DiscountTypeEnum },
  ) {
    if (!bookIds?.length) {
      return;
    }
    // update books
    const bookIdsStr = bookIds.join(', ');
    const discountValueExpression =
      discount.type === DiscountTypeEnum.PERCENTAGE
        ? `GREATEST(price - (price * ${discount.value} / 100), 0)`
        : `GREATEST(price - ${discount.value}, 0)`;

    await this.manager.query(`
        UPDATE "book"
        SET "discountId" = ${discount.id}, "discountPrice" = ${discountValueExpression}
        WHERE "id" IN (${bookIdsStr})
      `);
  }

  private async removeBooksFromDiscount(bookIds: number[]) {
    if (!bookIds?.length) {
      return;
    }
    // update books
    const bookIdsStr = bookIds.join(', ');
    await this.manager.query(`
        UPDATE "book"
        SET "discountId" = null, "discountPrice" = null
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
      return throwBadRequest('Discount not found');
    }
    // update books
    await this.manager.update(
      Book,
      { discountId: id },
      { discountId: null, discountPrice: null },
    );
    // delete discount
    await this.manager.delete(Discount, id);
  }
}
