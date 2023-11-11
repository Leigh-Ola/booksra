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
exports.SplitPurchase = void 0;
const typeorm_1 = require("typeorm");
const purchase_entity_1 = require("../purchases/purchase.entity");
let SplitPurchase = class SplitPurchase {
};
exports.SplitPurchase = SplitPurchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SplitPurchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'numeric',
        nullable: false,
        precision: 14,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], SplitPurchase.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], SplitPurchase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_entity_1.Purchase, (purchase) => purchase.splitPurchase),
    __metadata("design:type", Array)
], SplitPurchase.prototype, "purchases", void 0);
exports.SplitPurchase = SplitPurchase = __decorate([
    (0, typeorm_1.Entity)()
], SplitPurchase);
//# sourceMappingURL=splitPurchase.entity.js.map