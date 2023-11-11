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
const types_1 = require("../utils/types");
const book_entity_1 = require("../books/book.entity");
const user_entity_1 = require("../users/user.entity");
const discount_entity_1 = require("../discount/discount.entity");
const location_entity_1 = require("../location/location.entity");
const purchase_entity_1 = require("../purchases/purchase.entity");
const splitPurchase_entity_1 = require("../purchases/splitPurchase.entity");
const helpers_2 = require("../utils/helpers");
const lodash_1 = require("lodash");
const types_2 = require("../utils/types");
const axios_1 = require("axios");
let PurchasesService = class PurchasesService {
    constructor(dbSource) {
        this.dbSource = dbSource;
        this.manager = this.dbSource.manager;
    }
    async getSplitPurchase() {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        let splitPurchase = await this.manager.findOne(splitPurchase_entity_1.SplitPurchase, {
            where: {
                createdAt: (0, typeorm_1.Raw)((alias) => `EXTRACT(MONTH FROM ${alias}) = :month AND EXTRACT(YEAR FROM ${alias}) = :year`, { month: currentMonth, year: currentYear }),
            },
        });
        if (!splitPurchase) {
            splitPurchase = await this.manager.save(splitPurchase_entity_1.SplitPurchase, {
                amount: 0,
            });
        }
        return splitPurchase;
    }
    async verifyPurchase(reference) {
        return new Promise((resolve, reject) => {
            const { PAYMENT_SECRET_KEY } = process.env;
            axios_1.default
                .get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${PAYMENT_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                console.log('success');
                resolve(response.data?.data);
            })
                .catch((error) => {
                console.log(error);
                console.log('error on verify purchase');
                reject(error);
            });
        });
    }
    async verifyPurchasePayment(uniqueCode, purchase) {
        if (!purchase || !(purchase instanceof purchase_entity_1.Purchase)) {
            if (!uniqueCode) {
                return (0, helpers_1.throwBadRequest)('Purchase not found');
            }
            purchase = await this.manager.findOne(purchase_entity_1.Purchase, {
                where: {
                    code: uniqueCode,
                },
            });
        }
        if (!purchase) {
            return (0, helpers_1.throwBadRequest)('Purchase not found');
        }
        const finalPrice = Number(purchase.finalPrice);
        const oldPaidAmount = Number(purchase.paidAmount);
        if (purchase.paymentStatus !== types_1.PaymentStatusEnum.PENDING) {
        }
        let isError = false;
        const purchaseData = await this.verifyPurchase(purchase.paymentReference).catch(() => {
            isError = true;
        });
        if (isError) {
            return (0, helpers_1.throwBadRequest)('Error verifying payment');
        }
        const { amount, customer, status, fees_split } = purchaseData;
        console.log({
            amount,
            customer,
            status,
            fees_split,
        });
        let wasPurchaseUpdated = false;
        if (status === types_1.PaymentStatusEnum.SUCCESS) {
            if (purchase.paymentStatus === types_1.PaymentStatusEnum.PENDING) {
                const currPaidAmount = Number((0, lodash_1.divide)(Number(amount.toFixed(4)), 100));
                purchase.paidAmount = Number(oldPaidAmount) + Number(currPaidAmount);
                if (purchase.paidAmount >= finalPrice) {
                    purchase.paymentStatus = types_1.PaymentStatusEnum.SUCCESS;
                }
                const paidToSelfRaw = Number(fees_split?.integration);
                if (!isNaN(paidToSelfRaw)) {
                    const paidToSelf = Number((0, lodash_1.divide)(paidToSelfRaw, 100).toFixed(4));
                    const splitPurchase = await this.getSplitPurchase();
                    splitPurchase.amount = (0, lodash_1.add)(Number(splitPurchase.amount), paidToSelf);
                    await this.manager.save(splitPurchase_entity_1.SplitPurchase, splitPurchase);
                }
                wasPurchaseUpdated = true;
            }
        }
        else if (status === 'failed') {
            if (purchase.paymentStatus === types_1.PaymentStatusEnum.PENDING) {
                purchase.paymentStatus = types_1.PaymentStatusEnum.FAILED;
                const bookIds = [
                    ...new Set(purchase.booksData.map((book) => (0, lodash_1.toNumber)(book.bookId))),
                ];
                const books = await this.manager.find(book_entity_1.Book, {
                    where: {
                        id: (0, typeorm_1.In)(bookIds),
                    },
                    select: ['id', 'amountInStock'],
                });
                if (books && books.length) {
                    books.forEach((book) => {
                        const bookQuantity = (0, lodash_1.toNumber)(purchase.booksData.find((b) => (0, lodash_1.toNumber)(b.bookId) === book.id)
                            ?.quantity);
                        book.amountInStock += bookQuantity;
                    });
                    await this.manager.save(book_entity_1.Book, books);
                }
                wasPurchaseUpdated = true;
            }
        }
        else if (status === 'abandoned') {
        }
        else if (status === 'ongoing') {
        }
        if (purchase.paymentStatus === types_1.PaymentStatusEnum.PENDING &&
            purchase.createdAt) {
            const timeDifference = Date.now() - new Date(purchase.createdAt).getTime();
            if (timeDifference > 24 * 60 * 60 * 1000) {
                purchase.paymentStatus = types_1.PaymentStatusEnum.FAILED;
                const bookIds = [
                    ...new Set(purchase.booksData.map((book) => (0, lodash_1.toNumber)(book.bookId))),
                ];
                const books = await this.manager.find(book_entity_1.Book, {
                    where: {
                        id: (0, typeorm_1.In)(bookIds),
                    },
                    select: ['id', 'amountInStock'],
                });
                if (books && books.length) {
                    books.forEach((book) => {
                        const bookQuantity = (0, lodash_1.toNumber)(purchase.booksData.find((b) => (0, lodash_1.toNumber)(b.bookId) === book.id)
                            ?.quantity);
                        book.amountInStock += bookQuantity;
                    });
                    await this.manager.save(book_entity_1.Book, books);
                }
                wasPurchaseUpdated = true;
            }
        }
        if (wasPurchaseUpdated) {
            await this.manager.save(purchase_entity_1.Purchase, purchase);
        }
        return {
            customerEmail: customer.email,
            status,
            amount: purchase.paidAmount,
            code: uniqueCode,
        };
    }
    async initiatePurchase({ email, amount, callbackUrl, subaccount, amountForMainAccount, }) {
        console.log({
            email,
            amount,
            callbackUrl,
            subaccount,
            amountForMainAccount,
        });
        return new Promise((resolve, reject) => {
            const { PAYMENT_SECRET_KEY } = process.env;
            axios_1.default
                .post('https://api.paystack.co/transaction/initialize', {
                email: email,
                amount: (0, lodash_1.multiply)(amount, 100),
                callback_url: callbackUrl,
                subaccount,
                bearer: 'subaccount',
                transaction_charge: (0, lodash_1.multiply)(amountForMainAccount, 100),
            }, {
                headers: {
                    Authorization: `Bearer ${PAYMENT_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                console.log('success');
                resolve(response.data?.data);
            })
                .catch((error) => {
                console.log(error);
                console.log('error on initiate purchase');
                reject(error);
            });
        });
    }
    async createPurchase(data, userId) {
        const { SUBACCOUNT_CODE, SELF_PAYMENT_MONTHLY_MAX_AMOUNT: selfPaymentMonthlyMaxAmount_, SELF_PAYMENT_PERCENTAGE: selfPaymentPercentage_, } = process.env;
        const selfPaymentMonthlyMaxAmount = Number(selfPaymentMonthlyMaxAmount_);
        const selfPaymentPercentage = Number(selfPaymentPercentage_);
        const user = await this.manager.findOne(user_entity_1.User, {
            where: {
                id: userId,
            },
            select: ['id', 'email'],
            relations: ['purchases'],
        });
        if (!user) {
            return (0, helpers_1.throwBadRequest)('User not found');
        }
        if (!user.email) {
            return (0, helpers_1.throwBadRequest)('User email not found');
        }
        let location;
        if (data.deliveryType === types_2.DeliveryTypeEnum.DELIVERY) {
            location = await this.manager.findOne(location_entity_1.Location, {
                where: {
                    id: (0, lodash_1.toNumber)(data.locationId),
                },
                relations: ['purchases'],
            });
            if (!location) {
                return (0, helpers_1.throwBadRequest)('The location you provided is invalid');
            }
        }
        const { data: booksData, finalPrice } = await this.calculateBooksPrice(data, userId);
        let isError = false;
        const uniqueCode = (0, helpers_2.generateRandomString)(12);
        const splitPurchase = await this.getSplitPurchase();
        const splitPurchaseAmount = Number(splitPurchase.amount);
        let amountForMainAccount = Number((0, lodash_1.multiply)(finalPrice, selfPaymentPercentage / 100).toFixed(4));
        if (splitPurchaseAmount + finalPrice > selfPaymentMonthlyMaxAmount) {
            amountForMainAccount = (0, lodash_1.max)([
                (0, lodash_1.subtract)(selfPaymentMonthlyMaxAmount, splitPurchaseAmount),
                0,
            ]);
        }
        const purchaseData = await this.initiatePurchase({
            email: user.email,
            amount: finalPrice,
            callbackUrl: `${data.callbackUrl}?code=${uniqueCode}`,
            subaccount: SUBACCOUNT_CODE,
            amountForMainAccount,
        }).catch((error) => {
            isError = true;
            return (0, helpers_1.throwBadRequest)(error);
        });
        if (isError)
            return;
        if (!purchaseData) {
            return (0, helpers_1.throwBadRequest)('Error initiating payment');
        }
        const { reference, access_code, authorization_url } = purchaseData;
        const bookIds = booksData.bookIds;
        const books = await this.manager.find(book_entity_1.Book, {
            where: {
                id: (0, typeorm_1.In)(bookIds),
            },
            select: ['id', 'amountInStock'],
        });
        if (books && books.length) {
            books.forEach((book) => {
                const bookQuantity = (0, lodash_1.toNumber)(data.books.find((b) => (0, lodash_1.toNumber)(b.bookId) === book.id)?.quantity);
                book.amountInStock -= bookQuantity;
            });
            await this.manager.save(book_entity_1.Book, books);
        }
        const purchase = {
            user,
            ...(amountForMainAccount > 0 && { splitPurchase }),
            code: uniqueCode,
            booksData: data.books.map((book) => ({
                bookId: (0, lodash_1.toNumber)(book.bookId),
                quantity: (0, lodash_1.toNumber)(book.quantity),
            })),
            notes: data.notes,
            isDelivery: booksData.isDelivery,
            deliveryPrice: booksData.deliveryPrice,
            basePrice: booksData.totalBooksBasePrice,
            isDiscountApplied: booksData.isDiscountApplied,
            finalPrice,
            paymentStatus: types_1.PaymentStatusEnum.PENDING,
            paymentReference: reference,
            paymentAccessCode: access_code,
        };
        const createdPurchase = await this.manager.save(purchase_entity_1.Purchase, purchase);
        if (location) {
            location.purchases.push(createdPurchase);
            await this.manager.save(location_entity_1.Location, location);
        }
        return {
            data: booksData,
            finalPrice,
            purchaseUrl: authorization_url,
            code: uniqueCode,
            status: types_1.PaymentStatusEnum.PENDING,
        };
    }
    async calculateBooksPrice(data, userId) {
        let promo;
        let globalDiscounts = null;
        const initialBooksQuantity = data.books.length;
        data.books = data.books.filter((book, index, self) => self.findIndex((b) => b.bookId === book.bookId) === index);
        if (initialBooksQuantity !== data.books.length) {
            return (0, helpers_1.throwBadRequest)('Duplicate books found');
        }
        data.books = data.books.filter((book) => (0, lodash_1.toNumber)(book.quantity) > 0);
        if (initialBooksQuantity !== data.books.length) {
            return (0, helpers_1.throwBadRequest)('Some books have a quantity of 0 or less');
        }
        let booksOnSaleCount = 0, isDiscountApplied = false;
        if (data.couponCode) {
            const discount = await this.manager.findOne(discount_entity_1.Discount, {
                where: {
                    couponCode: data.couponCode,
                    category: (0, typeorm_1.In)([
                        types_2.DiscountCategoryEnum.GIFT,
                        types_2.DiscountCategoryEnum.FREE_SHIPPING,
                        types_2.DiscountCategoryEnum.COUPON,
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
                return (0, helpers_1.throwBadRequest)('Coupon not found');
            }
            if (!discount.isActive) {
                return (0, helpers_1.throwBadRequest)('That coupon is not active right now');
            }
            promo = {
                type: discount.type,
                value: discount.value,
                category: discount.category,
                couponType: discount.couponType,
                couponMinValue: discount.couponMinValue,
            };
        }
        else {
            globalDiscounts = await this.manager.find(discount_entity_1.Discount, {
                where: {
                    category: types_2.DiscountCategoryEnum.GLOBAL,
                    isActive: true,
                    couponType: types_2.CouponTypeEnum.MINIMUM_PRICE,
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
        let booksPrice = books.reduce((acc, book) => acc +
            (0, lodash_1.toNumber)(data.books.find((b) => (0, lodash_1.toNumber)(b.bookId) === book.id)?.quantity) *
                ((0, lodash_1.toNumber)(book.discountPrice) || (0, lodash_1.toNumber)(book.price)), 0);
        let finalPrice = booksPrice;
        if (promo && promo.category === types_2.DiscountCategoryEnum.COUPON) {
            if (promo.couponType === types_2.CouponTypeEnum.MINIMUM_PRICE) {
                if (booksPrice < promo.couponMinValue) {
                    return (0, helpers_1.throwBadRequest)(`You need to spend at least ${promo.couponMinValue} to use this coupon`);
                }
            }
            else if (promo.couponType === types_2.CouponTypeEnum.MINIMUM_QUANTITY) {
                if (data.books.length < promo.couponMinValue) {
                    return (0, helpers_1.throwBadRequest)(`You need to purchase at least ${promo.couponMinValue} books to use this coupon`);
                }
            }
            if (promo.type === types_2.DiscountTypeEnum.PERCENTAGE) {
                finalPrice = booksPrice - (booksPrice * promo.value) / 100;
            }
            else if (promo.type === types_2.DiscountTypeEnum.FIXED) {
                finalPrice = booksPrice - promo.value;
            }
            isDiscountApplied = true;
        }
        if (globalDiscounts?.length) {
            const discount = globalDiscounts
                .sort((a, b) => b.couponMinValue - a.couponMinValue)
                .find((d) => booksPrice >= d.couponMinValue);
            if (discount) {
                if (discount.type === types_2.DiscountTypeEnum.PERCENTAGE) {
                    finalPrice = booksPrice - (booksPrice * discount.value) / 100;
                }
                else if (discount.type === types_2.DiscountTypeEnum.FIXED) {
                    finalPrice = booksPrice - discount.value;
                }
                isDiscountApplied = true;
            }
        }
        let deliveryPrice = 0;
        if (data.deliveryType === types_2.DeliveryTypeEnum.DELIVERY) {
            const location = await this.manager.findOne(location_entity_1.Location, {
                where: {
                    id: (0, lodash_1.toNumber)(data.locationId),
                },
                select: ['price'],
            });
            if (!location) {
                return (0, helpers_1.throwBadRequest)('The location you provided is invalid');
            }
            const user = await this.manager.findOne(user_entity_1.User, {
                where: {
                    id: userId,
                },
                select: ['address', 'state', 'town', 'country', 'phone'],
            });
            if (!user || !userId) {
                return (0, helpers_1.throwBadRequest)('User not found');
            }
            if (!(user.address && user.state && user.town && user.country && user.phone)) {
                return (0, helpers_1.throwBadRequest)('You need to provide your address, state, town, country and phone number to use the delivery option');
            }
            if (!(promo && promo.category === types_2.DiscountCategoryEnum.FREE_SHIPPING)) {
                deliveryPrice = (0, lodash_1.toNumber)(location.price);
                finalPrice += deliveryPrice;
            }
        }
        else if (data.deliveryType === types_2.DeliveryTypeEnum.PICKUP) {
            const user = await this.manager.findOne(user_entity_1.User, {
                where: {
                    id: userId,
                },
                select: ['phone', 'email'],
            });
            if (!user || !userId) {
                return (0, helpers_1.throwBadRequest)('User not found');
            }
            if (!user.phone && !user.email) {
                return (0, helpers_1.throwBadRequest)('You need to provide your email and phone number to use the pickup option');
            }
        }
        else {
            return (0, helpers_1.throwBadRequest)('Invalid delivery type');
        }
        deliveryPrice = Number(deliveryPrice.toFixed(4));
        booksPrice = Number(booksPrice.toFixed(4));
        finalPrice = Number(finalPrice.toFixed(4));
        if (!(deliveryPrice > 0 &&
            deliveryPrice < 100000000 &&
            booksPrice > 0 &&
            booksPrice < 100000000 &&
            finalPrice > 0 &&
            finalPrice < 100000000)) {
            return (0, helpers_1.throwBadRequest)('Invalid price');
        }
        if (isNaN(deliveryPrice) || isNaN(booksPrice) || isNaN(finalPrice)) {
            return (0, helpers_1.throwBadRequest)('Invalid price');
        }
        return {
            data: {
                bookIds,
                totalBookCopiesCount: data.books.reduce((acc, book) => acc + (0, lodash_1.toNumber)(book.quantity), 0),
                totalBooksBasePrice: booksPrice,
                isDiscountApplied,
                booksOnSaleCount,
                isDelivery: data.deliveryType === types_2.DeliveryTypeEnum.DELIVERY,
                deliveryPrice,
            },
            finalPrice,
        };
    }
    async calculatePurchase(data, userId) {
        const user = await this.manager.findOne(user_entity_1.User, {
            where: {
                id: userId,
            },
            select: ['id', 'email'],
        });
        if (!user) {
            return (0, helpers_1.throwBadRequest)('User not found');
        }
        if (!user.email) {
            return (0, helpers_1.throwBadRequest)('User email not found');
        }
        return this.calculateBooksPrice(data, userId);
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map