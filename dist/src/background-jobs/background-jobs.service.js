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
exports.BackgroundJobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const helpers_1 = require("../utils/helpers");
const book_entity_1 = require("../books/book.entity");
const discount_entity_1 = require("../discount/discount.entity");
const purchase_entity_1 = require("../purchases/purchase.entity");
const email_entity_1 = require("../misc/email.entity");
const purchases_service_1 = require("../purchases/purchases.service");
const types_1 = require("../utils/types");
const mail_service_1 = require("../mail/mail.service");
let BackgroundJobsService = class BackgroundJobsService {
    constructor(dbSource, purchasesService) {
        this.dbSource = dbSource;
        this.purchasesService = purchasesService;
        this.manager = this.dbSource.manager;
    }
    async validateCronCode(code) {
        const { BACKGROUND_JOB_CODE, ALLOW_BACKGROUND_JOBS } = process.env;
        if (String(ALLOW_BACKGROUND_JOBS) !== 'true') {
            return (0, helpers_1.throwBadRequest)('Background jobs not allowed');
        }
        if (code !== String(BACKGROUND_JOB_CODE)) {
            return (0, helpers_1.throwBadRequest)('Invalid code');
        }
    }
    async deleteOldBooks() {
        let books = await this.manager.find(book_entity_1.Book, {
            where: {
                updatedAt: (0, typeorm_1.Raw)((alias) => `${alias} < NOW() - INTERVAL '30 days'`),
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
        books = books.filter((book) => book.amountInStock === 0 || book.deletedAt !== null);
        await this.manager.remove(books);
    }
    async updateDiscountStatuses() {
        const discounts = await this.manager.find(discount_entity_1.Discount);
        if (!discounts?.length) {
            return;
        }
        const today = new Date();
        const discountsToActivate = discounts.filter((discount) => !discount.isActive &&
            discount.startDate <= today &&
            discount.endDate >= today);
        const discountsToDeactivate = discounts.filter((discount) => discount.isActive && discount.endDate < today);
        discountsToActivate.forEach((discount) => {
            discount.isActive = true;
        });
        discountsToDeactivate.forEach((discount) => {
            discount.isActive = false;
        });
        await this.manager.save(discount_entity_1.Discount, [
            ...discountsToActivate,
            ...discountsToDeactivate,
        ]);
    }
    async checkPaymentStatuses() {
        const purchasesToDelete = await this.manager.find(purchase_entity_1.Purchase, {
            where: {
                paymentStatus: types_1.PaymentStatusEnum.PENDING,
                updatedAt: (0, typeorm_1.Raw)((alias) => `${alias} < NOW() - INTERVAL '7 days'`),
            },
        });
        if (purchasesToDelete?.length) {
            await this.manager.remove(purchasesToDelete);
        }
        let purchases = await this.manager.find(purchase_entity_1.Purchase, {
            where: {
                paymentStatus: types_1.PaymentStatusEnum.PENDING,
                updatedAt: (0, typeorm_1.Raw)((alias) => `${alias} > NOW() - INTERVAL '3 days'`),
            },
            order: {
                updatedAt: 'DESC',
            },
            take: 20,
        });
        if (!purchases?.length) {
            return;
        }
        purchases = purchases.reverse();
        for await (const purchase of purchases) {
            await this.purchasesService
                .verifyPurchasePayment(null, purchase)
                .catch((err) => { });
        }
    }
    async sendEmails() {
        const emails = await this.manager.find(email_entity_1.Email, {
            where: {
                status: (0, typeorm_1.Any)([types_1.EmailStatusEnum.FAILED, types_1.EmailStatusEnum.PENDING]),
                tries: (0, typeorm_1.LessThan)(5),
            },
            take: 30,
        });
        if (!emails?.length) {
            return;
        }
        for await (const email of emails) {
            await (0, mail_service_1.sendMail)(email.data)
                .then(() => {
                email.status = types_1.EmailStatusEnum.SUCCESS;
            })
                .catch(() => {
                email.status = types_1.EmailStatusEnum.FAILED;
            })
                .finally(() => {
                email.tries += 1;
            });
        }
        this.manager.save(email_entity_1.Email, emails);
    }
};
exports.BackgroundJobsService = BackgroundJobsService;
exports.BackgroundJobsService = BackgroundJobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        purchases_service_1.PurchasesService])
], BackgroundJobsService);
//# sourceMappingURL=background-jobs.service.js.map