"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const discount_entity_1 = require("./discount.entity");
const book_entity_1 = require("../books/book.entity");
const types_1 = require("../utils/types");
const lodash_1 = require("lodash");
const helpers_1 = require("../utils/helpers");
let DiscountService = class DiscountService {
    constructor(dbSource) {
        this.dbSource = dbSource;
        this.manager = this.dbSource.manager;
    }
    async isDatePassed(date, compareDate) {
        return date.getTime() <= compareDate.getTime();
    }
    async create(discountDto) {
        discountDto = (0, lodash_1.pick)(discountDto, [
            'name',
            'couponCode',
            'type',
            'value',
            'startDate',
            'endDate',
            'bookIds',
        ]);
        if (discountDto.type === types_1.DiscountTypeEnum.PERCENTAGE &&
            (discountDto.value < 0 || discountDto.value > 100)) {
            return (0, helpers_1.throwBadRequest)('For percentage discounts, the value should be between 0 and 100');
        }
        if (discountDto.type === types_1.DiscountTypeEnum.FIXED && discountDto.value <= 0) {
            return (0, helpers_1.throwBadRequest)('For fixed discounts, the value should be greater than 0');
        }
        if (await this.isDatePassed(new Date(discountDto.endDate), new Date())) {
            return (0, helpers_1.throwBadRequest)('The end date has passed');
        }
        if (discountDto.couponCode) {
            const existingDiscount = await this.manager.findOne(discount_entity_1.Discount, {
                where: {
                    couponCode: String(discountDto.couponCode).toLowerCase(),
                },
            });
            if (existingDiscount) {
                return (0, helpers_1.throwBadRequest)('This coupon code already exists');
            }
            else {
                discountDto.couponCode = String(discountDto.couponCode).toLowerCase();
            }
        }
        const discount = discountDto;
        if (await this.isDatePassed(new Date(discountDto.startDate), new Date())) {
            discount.isActive = true;
        }
        else {
            discount.isActive = false;
        }
        const foundBooks = await this.manager.find(book_entity_1.Book, {
            where: {
                id: (0, typeorm_1.In)(discountDto.bookIds),
            },
            relations: ['discount'],
        });
        if (foundBooks.length !== discountDto.bookIds.length) {
            return (0, helpers_1.throwBadRequest)(discount.bookIds.length -
                foundBooks.length +
                ' book(s) you selected were not found');
        }
        const booksWithDiscount = foundBooks.filter((book) => book.discount);
        if (booksWithDiscount.length) {
            return (0, helpers_1.throwBadRequest)('Unable to proceed. The following books already have a discount: ' +
                booksWithDiscount.map((book) => book.code).join(', '));
        }
        discount.books = foundBooks;
        const newDiscount = await this.manager.create(discount_entity_1.Discount, discount);
        const createdDiscount = await this.manager.save(newDiscount);
        await this.updateBooks(discountDto.bookIds, createdDiscount);
    }
    async update(id, discountDto) {
        if (!id || isNaN(id)) {
            return (0, helpers_1.throwBadRequest)('Discount ID is required');
        }
        const discountExists = await this.manager.findOne(discount_entity_1.Discount, {
            where: {
                id,
            },
            select: ['id'],
        });
        if (!discountExists) {
            return (0, helpers_1.throwBadRequest)('Discount not found');
        }
        discountDto = (0, lodash_1.pick)(discountDto, [
            'name',
            'couponCode',
            'type',
            'value',
            'startDate',
            'endDate',
            'bookIds',
        ]);
        if (discountDto.type === types_1.DiscountTypeEnum.PERCENTAGE &&
            (discountDto.value < 0 || discountDto.value > 100)) {
            return (0, helpers_1.throwBadRequest)('For percentage discounts, the value should be between 0 and 100');
        }
        if (discountDto.type === types_1.DiscountTypeEnum.FIXED && discountDto.value <= 0) {
            return (0, helpers_1.throwBadRequest)('For fixed discounts, the value should be greater than 0');
        }
        if (await this.isDatePassed(new Date(discountDto.endDate), new Date())) {
            return (0, helpers_1.throwBadRequest)('The end date has passed');
        }
        if (discountDto.couponCode) {
            const discountWithSameCouponCode = await this.manager.findOne(discount_entity_1.Discount, {
                where: {
                    couponCode: String(discountDto.couponCode).toLowerCase(),
                },
            });
            if (discountWithSameCouponCode && discountWithSameCouponCode.id !== id) {
                return (0, helpers_1.throwBadRequest)('This coupon code already exists');
            }
            else {
                discountDto.couponCode = String(discountDto.couponCode).toLowerCase();
            }
        }
        const discount = discountDto;
        if (await this.isDatePassed(new Date(discountDto.startDate), new Date())) {
            discount.isActive = true;
        }
        else {
            discount.isActive = false;
        }
        if (discountDto.bookIds?.length) {
            const foundBooks = await this.manager.find(book_entity_1.Book, {
                where: {
                    id: (0, typeorm_1.In)(discountDto.bookIds),
                },
                relations: ['discount'],
            });
            if (foundBooks.length !== discountDto.bookIds.length) {
                return (0, helpers_1.throwBadRequest)(discount.bookIds.length -
                    foundBooks.length +
                    ' book(s) you selected were not found');
            }
            const booksWithDiscount = foundBooks.filter((book) => book.discount && book.discount.id !== id);
            if (booksWithDiscount.length) {
                return (0, helpers_1.throwBadRequest)('Unable to proceed. The following books already have another discount: ' +
                    booksWithDiscount.map((book) => book.code).join(', '));
            }
            discount.books = foundBooks;
        }
        const updatedDiscount = (0, lodash_1.merge)(discountExists, discount);
        await this.manager.save(updatedDiscount);
        await this.updateBooks(discountDto.bookIds, updatedDiscount);
    }
    async updateBooks(bookIds, discount) {
        if (!bookIds?.length) {
            return;
        }
        const bookIdsStr = bookIds.join(', ');
        const discountValueExpression = discount.type === types_1.DiscountTypeEnum.PERCENTAGE
            ? `GREATEST(price - (price * ${discount.value} / 100), 0)`
            : `GREATEST(price - ${discount.value}, 0)`;
        await this.manager.query(`
        UPDATE "book"
        SET "discountId" = ${discount.id}, "discountPrice" = ${discountValueExpression}
        WHERE "id" IN (${bookIdsStr})
      `);
    }
    async find({ page, limit, query, } = { page: 1, limit: 10, query: '' }) {
        page = Number(page) || 1;
        limit = Number(limit) || 10;
        page = page < 1 ? 1 : page;
        limit = limit < 1 ? 1 : limit > 100 ? 100 : limit;
        if (!query) {
            return await this.manager.find(discount_entity_1.Discount, {
                take: limit,
                skip: (page - 1) * limit,
            });
        }
        const discounts = await this.manager.find(discount_entity_1.Discount, {
            where: [{ name: (0, typeorm_1.ILike)(`%${query}%`) }, { couponCode: query }],
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
            });
            return discount;
        });
    }
    async delete(id) {
        const discount = await this.manager.findOne(discount_entity_1.Discount, {
            where: {
                id,
            },
        });
        if (!discount) {
            return (0, helpers_1.throwBadRequest)('Discount not found');
        }
        await this.manager.update(book_entity_1.Book, { discountId: id }, { discountId: null, discountPrice: null });
        await this.manager.delete(discount_entity_1.Discount, id);
    }
};
exports.DiscountService = DiscountService;
exports.DiscountService = DiscountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DiscountService);
//# sourceMappingURL=discount.service.js.map