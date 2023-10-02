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
exports.EntityController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const entities_service_1 = require("./entities.service");
let EntityController = class EntityController {
    constructor(entityService) {
        this.entityService = entityService;
    }
    async getGenre(q) {
        return this.entityService.findGenre(q);
    }
    async getCategory(q) {
        return this.entityService.findCategory(q);
    }
    async getAgeRange(q) {
        return this.entityService.findAgeRange(q);
    }
};
exports.EntityController = EntityController;
__decorate([
    (0, common_1.Get)('/genre'),
    __param(0, (0, common_2.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntityController.prototype, "getGenre", null);
__decorate([
    (0, common_1.Get)('/category'),
    __param(0, (0, common_2.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntityController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Get)('/age-range'),
    __param(0, (0, common_2.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntityController.prototype, "getAgeRange", null);
exports.EntityController = EntityController = __decorate([
    (0, common_1.Controller)('entities'),
    __metadata("design:paramtypes", [entities_service_1.EntityService])
], EntityController);
//# sourceMappingURL=entities.controller.js.map