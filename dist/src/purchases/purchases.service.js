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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const helpers_1 = require("../utils/helpers");
const book_entity_1 = require("../books/book.entity");
const discount_entity_1 = require("../discount/discount.entity");
const location_entity_1 = require("../location/location.entity");
const lodash_1 = require("lodash");
const types_1 = require("../utils/types");
let PurchasesService = class PurchasesService {
    constructor(dbSource) {
        this.dbSource = dbSource;
        this.manager = this.dbSource.manager;
    }
    async calculatePurchase(data, userId) {
        const user = await this.manager.findOne('User', {
            where: {
                id: userId,
            },
            select: ['id'],
        });
        if (!user) {
            (0, helpers_1.throwBadRequest)('User not found');
        }
        return this.calculateBooksPrice(data);
    }
    async createPurchase(data, userId) {
        const user = await this.manager.findOne('User', {
            where: {
                id: userId,
            },
            select: ['id'],
        });
        if (!user) {
            (0, helpers_1.throwBadRequest)('User not found');
        }
        return;
    }
    async calculateBooksPrice(data) {
        let promo;
        let globalDiscounts = null;
        data.books = data.books.filter((book, index, self) => self.findIndex((b) => b.bookId === book.bookId) === index);
        data.books = data.books.filter((book) => (0, lodash_1.toNumber)(book.quantity) > 0);
        let booksOnSaleCount = 0, isDiscountApplied = false;
        if (data.couponCode) {
            const discount = await this.manager.findOne(discount_entity_1.Discount, {
                where: {
                    couponCode: data.couponCode,
                    category: types_1.DiscountCategoryEnum.COUPON,
                },
                select: ['type', 'value', 'couponType', 'couponMinValue', 'isActive'],
            });
            if (!discount) {
                (0, helpers_1.throwBadRequest)('Coupon not found');
            }
            if (!discount.isActive) {
                (0, helpers_1.throwBadRequest)('That coupon is not active right now');
            }
            promo = {
                type: discount.type,
                value: discount.value,
                couponType: discount.couponType,
                couponMinValue: discount.couponMinValue,
            };
        }
        else {
            globalDiscounts = await this.manager.find(discount_entity_1.Discount, {
                where: {
                    category: types_1.DiscountCategoryEnum.GLOBAL,
                    isActive: true,
                    couponType: types_1.CouponTypeEnum.MINIMUM_PRICE,
                },
                select: ['type', 'value', 'couponType', 'couponMinValue'],
            });
        }
        const bookIds = data.books.map((book) => (0, lodash_1.toNumber)(book.bookId));
        const books = await this.manager.find(book_entity_1.Book, {
            where: {
                id: (0, typeorm_1.In)(bookIds),
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
            return (0, helpers_1.throwBadRequest)('Some of the books provided are invalid');
        }
        const booksNotInStock = books.filter((book) => book.amountInStock <
            (0, lodash_1.toNumber)(data.books.find((b) => (0, lodash_1.toNumber)(b.bookId) === book.id)?.quantity));
        if (booksNotInStock.length) {
            return (0, helpers_1.throwBadRequest)(`Your purchase exceeds our available stock of the following books: ${booksNotInStock
                .map((book) => book.title)
                .join(', ')}`);
        }
        booksOnSaleCount = books.filter((book) => book.discountPrice).length;
        const booksPrice = books.reduce((acc, book) => acc +
            (0, lodash_1.toNumber)(data.books.find((b) => (0, lodash_1.toNumber)(b.bookId) === book.id)?.quantity) *
                ((0, lodash_1.toNumber)(book.discountPrice) || (0, lodash_1.toNumber)(book.price)), 0);
        let finalPrice = booksPrice;
        if (promo) {
            if (promo.couponType === types_1.CouponTypeEnum.MINIMUM_PRICE) {
                if (booksPrice < promo.couponMinValue) {
                    (0, helpers_1.throwBadRequest)(`You need to spend at least ${promo.couponMinValue} to use this coupon`);
                }
            }
            else if (promo.couponType === types_1.CouponTypeEnum.MINIMUM_QUANTITY) {
                if (data.books.length < promo.couponMinValue) {
                    (0, helpers_1.throwBadRequest)(`You need to purchase at least ${promo.couponMinValue} books to use this coupon`);
                }
            }
            if (promo.type === types_1.DiscountTypeEnum.PERCENTAGE) {
                finalPrice = booksPrice - (booksPrice * promo.value) / 100;
            }
            else if (promo.type === types_1.DiscountTypeEnum.FIXED) {
                finalPrice = booksPrice - promo.value;
            }
            isDiscountApplied = true;
        }
        else if (globalDiscounts?.length) {
            const discount = globalDiscounts
                .sort((a, b) => b.couponMinValue - a.couponMinValue)
                .find((d) => booksPrice >= d.couponMinValue);
            if (discount) {
                if (discount.type === types_1.DiscountTypeEnum.PERCENTAGE) {
                    finalPrice = booksPrice - (booksPrice * discount.value) / 100;
                }
                else if (discount.type === types_1.DiscountTypeEnum.FIXED) {
                    finalPrice = booksPrice - discount.value;
                }
                isDiscountApplied = true;
            }
        }
        let deliveryPrice = 0;
        if (data.deliveryType === types_1.DeliveryTypeEnum.DELIVERY) {
            const location = await this.manager.findOne(location_entity_1.Location, {
                where: {
                    id: (0, lodash_1.toNumber)(data.locationId),
                },
                select: ['price'],
            });
            if (!location) {
                (0, helpers_1.throwBadRequest)('The location you provided is invalid');
            }
            deliveryPrice = (0, lodash_1.toNumber)(location.price);
            finalPrice += deliveryPrice;
        }
        return {
            data: {
                bookIds,
                totalBookCopiesCount: data.books.reduce((acc, book) => acc + (0, lodash_1.toNumber)(book.quantity), 0),
                totalBooksBasePrice: booksPrice,
                isDiscountApplied,
                booksOnSaleCount,
                isDelivery: data.deliveryType === types_1.DeliveryTypeEnum.DELIVERY,
                deliveryPrice,
            },
            finalPrice,
        };
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map