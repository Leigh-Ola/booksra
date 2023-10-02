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
exports.PurchasesController = void 0;
const common_1 = require("@nestjs/common");
const purchases_service_1 = require("./purchases.service");
const users_guard_1 = require("../users/users-guard");
const purchases_dto_1 = require("./dto/purchases.dto");
let PurchasesController = class PurchasesController {
    constructor(purchasesService) {
        this.purchasesService = purchasesService;
    }
    async getGenre(req, data) {
        const id = req.user.id;
        return this.purchasesService.calculatePurchase(data, id);
    }
    async createPurchase(req, data) {
        const id = req.user.id;
        return this.purchasesService.createPurchase(data, id);
    }
};
exports.PurchasesController = PurchasesController;
__decorate([
    (0, common_1.Post)('/calculate'),
    (0, common_1.UseGuards)(users_guard_1.IsUser),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, purchases_dto_1.CalculatePurchaseDto]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getGenre", null);
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.UseGuards)(users_guard_1.IsUser),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, purchases_dto_1.CalculatePurchaseDto]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "createPurchase", null);
exports.PurchasesController = PurchasesController = __decorate([
    (0, common_1.Controller)('purchase'),
    __metadata("design:paramtypes", [purchases_service_1.PurchasesService])
], PurchasesController);
//# sourceMappingURL=purchases.controller.js.map