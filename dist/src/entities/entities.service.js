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
exports.EntityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const genre_entity_1 = require("../books/genre.entity");
const category_entity_1 = require("../books/category.entity");
const age_range_entity_1 = require("../books/age-range.entity");
let EntityService = class EntityService {
    constructor(dbSource) {
        this.dbSource = dbSource;
        this.manager = this.dbSource.manager;
    }
    async findGenre(q) {
        return ((await this.manager.find(genre_entity_1.Genre, {
            where: { name: (0, typeorm_1.ILike)(`%${q}%`) },
            select: ['name'],
        })).map((item) => item.name) || []);
    }
    async findCategory(q) {
        return ((await this.manager.find(category_entity_1.Category, {
            where: { name: (0, typeorm_1.ILike)(`%${q}%`) },
            select: ['name'],
        })).map((item) => item.name) || []);
    }
    async findAgeRange(q) {
        return ((await this.manager.find(age_range_entity_1.AgeRange, {
            where: { name: (0, typeorm_1.ILike)(`%${q}%`) },
            select: ['name'],
        }))?.map((item) => item.name) || []);
    }
};
exports.EntityService = EntityService;
exports.EntityService = EntityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EntityService);
//# sourceMappingURL=entities.service.js.map