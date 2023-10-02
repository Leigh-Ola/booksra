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
exports.UpdateBookDto = exports.CreateBookDto = void 0;
const class_validator_1 = require("class-validator");
const types_1 = require("../../utils/types");
class CreateBookDto {
}
exports.CreateBookDto = CreateBookDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateBookDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreateBookDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateBookDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(types_1.BookCoversEnum),
    __metadata("design:type", String)
], CreateBookDto.prototype, "cover", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(99999),
    __metadata("design:type", Number)
], CreateBookDto.prototype, "amountInStock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({
        maxDecimalPlaces: 2,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(9999999),
    __metadata("design:type", Number)
], CreateBookDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBookDto.prototype, "genre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateBookDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9]+$|^[0-9]+\+$/, {
        message: 'Age range must be in the format of 0-0 or 0+',
    }),
    (0, class_validator_1.MaxLength)(7),
    __metadata("design:type", String)
], CreateBookDto.prototype, "ageRange", void 0);
class UpdateBookDto {
}
exports.UpdateBookDto = UpdateBookDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(types_1.BookCoversEnum),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "cover", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(99999),
    __metadata("design:type", Number)
], UpdateBookDto.prototype, "amountInStock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({
        maxDecimalPlaces: 2,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(9999999),
    __metadata("design:type", Number)
], UpdateBookDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateBookDto.prototype, "genre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9]+$|^[0-9]+\+$/, {
        message: 'Age range must be in the format of 0-0 or 0+',
    }),
    (0, class_validator_1.MaxLength)(7),
    __metadata("design:type", String)
], UpdateBookDto.prototype, "ageRange", void 0);
//# sourceMappingURL=books-dto.js.map