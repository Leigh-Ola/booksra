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
exports.BookController = void 0;
const books_service_1 = require("./books.service");
const common_1 = require("@nestjs/common");
const users_guard_1 = require("../users/users-guard");
const books_dto_1 = require("./dto/books-dto");
const types_1 = require("../utils/types");
let BookController = class BookController {
    constructor(booksService) {
        this.booksService = booksService;
    }
    async create(book) {
        return this.booksService.create(book);
    }
    async update(id, data) {
        return this.booksService.update(id, data);
    }
    async findAll(req, title, code, genre, category, ageRange, cover, page, limit, sortByPrice) {
        const userRole = req.user?.role;
        return this.booksService.getBooks({
            title,
            code,
            genre,
            category,
            ageRange,
            cover,
            sortByPrice,
        }, {
            page,
            limit,
        }, {
            userRole,
        });
    }
    async findOne(id, req) {
        const userRole = req.user?.role;
        return this.booksService.getBook(id, {
            userRole,
        });
    }
    async toggle(id, data) {
        return this.booksService.toggle(id, data);
    }
};
exports.BookController = BookController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(users_guard_1.IsAdminUser),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [books_dto_1.CreateBookDto]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(users_guard_1.IsAdminUser),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, books_dto_1.UpdateBookDto]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(users_guard_1.IsAnyone),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('title')),
    __param(2, (0, common_1.Query)('code')),
    __param(3, (0, common_1.Query)('genre')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('ageRange')),
    __param(6, (0, common_1.Query)('cover')),
    __param(7, (0, common_1.Query)('page')),
    __param(8, (0, common_1.Query)('limit')),
    __param(9, (0, common_1.Query)('sortByPrice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(users_guard_1.IsAnyone),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/toggle'),
    (0, common_1.UseGuards)(users_guard_1.IsAdminUser),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "toggle", null);
exports.BookController = BookController = __decorate([
    (0, common_1.Controller)('book'),
    __metadata("design:paramtypes", [books_service_1.BookService])
], BookController);
//# sourceMappingURL=books.controller.js.map