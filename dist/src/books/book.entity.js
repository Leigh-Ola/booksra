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
exports.Book = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("../utils/types");
const genre_entity_1 = require("./genre.entity");
const category_entity_1 = require("./category.entity");
const age_range_entity_1 = require("./age-range.entity");
const discount_entity_1 = require("../discount/discount.entity");
let Book = class Book {
};
exports.Book = Book;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Book.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Book.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, unique: true, nullable: false }),
    __metadata("design:type", String)
], Book.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: types_1.BookCoversEnum, nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "cover", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0, nullable: false }),
    __metadata("design:type", Number)
], Book.prototype, "amountInStock", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], Book.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], Book.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], Book.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'numeric',
        nullable: true,
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Book.prototype, "discountPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: false, precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Book.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Book.prototype, "discountId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Book.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Book.prototype, "ageRangeId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => genre_entity_1.Genre, (genre) => genre.books, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Book.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.books),
    __metadata("design:type", category_entity_1.Category)
], Book.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => age_range_entity_1.AgeRange, (agerange) => agerange.books),
    __metadata("design:type", age_range_entity_1.AgeRange)
], Book.prototype, "ageRange", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => discount_entity_1.Discount, (discount) => discount.books),
    __metadata("design:type", discount_entity_1.Discount)
], Book.prototype, "discount", void 0);
exports.Book = Book = __decorate([
    (0, typeorm_1.Entity)()
], Book);
//# sourceMappingURL=book.entity.js.map