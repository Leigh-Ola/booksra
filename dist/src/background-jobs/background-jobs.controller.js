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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundJobsController = void 0;
const common_1 = require("@nestjs/common");
const background_jobs_service_1 = require("./background-jobs.service");
let BackgroundJobsController = class BackgroundJobsController {
    constructor(backgroundJobsService) {
        this.backgroundJobsService = backgroundJobsService;
    }
    async getGenre(code) {
        await this.backgroundJobsService.validateCronCode(code);
        this.backgroundJobsService.deleteOldBooks();
    }
    async checkDiscountStatus(code) {
        await this.backgroundJobsService.validateCronCode(code);
        this.backgroundJobsService.updateDiscountStatuses();
    }
    async checkPaymentStatus(code) {
        await this.backgroundJobsService.validateCronCode(code);
        this.backgroundJobsService.checkPaymentStatuses();
    }
    async sendEmails(code) {
        await this.backgroundJobsService.validateCronCode(code);
        this.backgroundJobsService.sendEmails();
    }
};
exports.BackgroundJobsController = BackgroundJobsController;
__decorate([
    (0, common_1.Get)('/delete-old-books'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackgroundJobsController.prototype, "getGenre", null);
__decorate([
    (0, common_1.Get)('/update-discount-statuses'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackgroundJobsController.prototype, "checkDiscountStatus", null);
__decorate([
    (0, common_1.Get)('/check-payment-statuses'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackgroundJobsController.prototype, "checkPaymentStatus", null);
__decorate([
    (0, common_1.Get)('/send-emails'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackgroundJobsController.prototype, "sendEmails", null);
exports.BackgroundJobsController = BackgroundJobsController = __decorate([
    (0, common_1.Controller)('background-jobs'),
    __metadata("design:paramtypes", [background_jobs_service_1.BackgroundJobsService])
], BackgroundJobsController);
//# sourceMappingURL=background-jobs.controller.js.map