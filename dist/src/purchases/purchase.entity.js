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
exports.Purchase = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const location_entity_1 = require("../location/location.entity");
const splitPurchase_entity_1 = require("./splitPurchase.entity");
const types_1 = require("../utils/types");
let Purchase = class Purchase {
};
exports.Purchase = Purchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Purchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, unique: true }),
    __metadata("design:type", String)
], Purchase.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: false }),
    __metadata("design:type", Array)
], Purchase.prototype, "booksData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Purchase.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], Purchase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.purchases),
    __metadata("design:type", user_entity_1.User)
], Purchase.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: false }),
    __metadata("design:type", Boolean)
], Purchase.prototype, "isDelivery", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true, precision: 14, scale: 4 }),
    __metadata("design:type", Number)
], Purchase.prototype, "deliveryPrice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location, (location) => location.purchases),
    __metadata("design:type", location_entity_1.Location)
], Purchase.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => splitPurchase_entity_1.SplitPurchase, (splitPurchase) => splitPurchase.purchases),
    __metadata("design:type", splitPurchase_entity_1.SplitPurchase)
], Purchase.prototype, "splitPurchase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: false, precision: 14, scale: 4 }),
    __metadata("design:type", Number)
], Purchase.prototype, "basePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: false }),
    __metadata("design:type", Boolean)
], Purchase.prototype, "isDiscountApplied", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: false, precision: 14, scale: 4 }),
    __metadata("design:type", Number)
], Purchase.prototype, "finalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'numeric',
        nullable: false,
        precision: 14,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], Purchase.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: types_1.PaymentStatusEnum, nullable: false }),
    __metadata("design:type", String)
], Purchase.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Purchase.prototype, "paymentReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Purchase.prototype, "paymentAccessCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Purchase.prototype, "emailSent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], Purchase.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], Purchase.prototype, "updatedAt", void 0);
exports.Purchase = Purchase = __decorate([
    (0, typeorm_1.Entity)()
], Purchase);
//# sourceMappingURL=purchase.entity.js.map