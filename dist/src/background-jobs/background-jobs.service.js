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
let BackgroundJobsService = class BackgroundJobsService {
    constructor(dbSource) {
        this.dbSource = dbSource;
        this.manager = this.dbSource.manager;
    }
    async deleteOldBooks(code) {
        const { BACKGROUND_JOB_CODE, ALLOW_BACKGROUND_JOBS } = process.env;
        if (ALLOW_BACKGROUND_JOBS !== 'true') {
            return (0, helpers_1.throwBadRequest)('Background jobs not allowed');
        }
        if (code !== BACKGROUND_JOB_CODE) {
            return (0, helpers_1.throwBadRequest)('Invalid code');
        }
        const books = await this.manager.find(book_entity_1.Book, {
            where: {
                amountInStock: 0,
                updatedAt: (0, typeorm_1.Raw)((alias) => `${alias} < NOW() - INTERVAL '30 days'`),
            },
            withDeleted: true,
        });
        if (!books?.length) {
            return;
        }
        await this.manager.remove(books);
    }
    async updateDiscountStatuses(code) {
        const { BACKGROUND_JOB_CODE, ALLOW_BACKGROUND_JOBS } = process.env;
        if (ALLOW_BACKGROUND_JOBS !== 'true') {
            return (0, helpers_1.throwBadRequest)('Background jobs not allowed');
        }
        if (code !== BACKGROUND_JOB_CODE) {
            return (0, helpers_1.throwBadRequest)('Invalid code');
        }
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
};
exports.BackgroundJobsService = BackgroundJobsService;
exports.BackgroundJobsService = BackgroundJobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BackgroundJobsService);
//# sourceMappingURL=background-jobs.service.js.map