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
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("./book.entity");
const discount_entity_1 = require("../discount/discount.entity");
const age_range_entity_1 = require("./age-range.entity");
const category_entity_1 = require("./category.entity");
const genre_entity_1 = require("./genre.entity");
const lodash_1 = require("lodash");
const helpers_1 = require("../utils/helpers");
const types_1 = require("../utils/types");
let BookService = class BookService {
    constructor(bookRepository, dbSource) {
        this.bookRepository = bookRepository;
        this.dbSource = dbSource;
        this.manager = this.dbSource.manager;
    }
    removeNestedFields(collection, fields) {
        return collection.map((item) => {
            return (0, lodash_1.omit)(item, fields);
        });
    }
    async create(book) {
        if (!book.code || !book.imageUrl || !book.price || !book.amountInStock) {
            return (0, helpers_1.throwBadRequest)('Book code, image, price and amount in stock are required');
        }
        const bookWithCodeExists = await this.manager.findOne(book_entity_1.Book, {
            where: { code: book.code },
            select: ['id'],
            withDeleted: true,
        });
        if (bookWithCodeExists) {
            return (0, helpers_1.throwBadRequest)('Book code already exists');
        }
        const bookPartial = (0, lodash_1.pick)(book, [
            'title',
            'code',
            'description',
            'cover',
            'imageUrl',
        ]);
        const amountInStock = Number(book.amountInStock);
        if (!isNaN(amountInStock) && amountInStock >= 0) {
            bookPartial.amountInStock = amountInStock;
        }
        else {
            return (0, helpers_1.throwBadRequest)('Invalid amount in stock');
        }
        const price = Number(book.price);
        if (!isNaN(price) && price >= 0) {
            bookPartial.price = price;
        }
        else {
            return (0, helpers_1.throwBadRequest)('Invalid price');
        }
        if (book.ageRange) {
            const bookAgeRange = String(book.ageRange).toLowerCase();
            const ageRangeExists = await this.manager.findOne(age_range_entity_1.AgeRange, {
                where: { name: bookAgeRange },
                select: ['id'],
            });
            if (ageRangeExists) {
                bookPartial.ageRangeId = ageRangeExists.id;
            }
            else {
                const newAgeRange = await this.manager.save(this.manager.create(age_range_entity_1.AgeRange, {
                    name: bookAgeRange,
                }));
                bookPartial.ageRangeId = newAgeRange.id;
            }
        }
        if (book.category) {
            const bookCategory = String(book.category).toLowerCase();
            const categoryExists = await this.manager.findOne(category_entity_1.Category, {
                where: { name: bookCategory },
                select: ['id'],
            });
            if (categoryExists) {
                bookPartial.categoryId = categoryExists.id;
            }
            else {
                const newCategory = await this.manager.save(this.manager.create(category_entity_1.Category, {
                    name: bookCategory,
                }));
                bookPartial.categoryId = newCategory.id;
            }
        }
        let genreEntities;
        if (book.genre) {
            const genres = Array.from(book.genre)
                .filter((item) => typeof item === 'string' && item.length > 0)
                .map((item) => item.trim().toLowerCase());
            genreEntities = await this.manager.find(genre_entity_1.Genre, {
                where: { name: (0, typeorm_2.In)(genres) },
                select: ['id', 'name'],
            });
            const genresToCreate = genres.filter((item) => !genreEntities.find((genre) => genre.name === item));
            if (genresToCreate.length > 0) {
                const createdGenres = (await this.manager.save(this.manager.create(genre_entity_1.Genre, genresToCreate.map((item) => ({ name: item })))));
                genreEntities.push(...createdGenres);
            }
        }
        const newBook = this.bookRepository.create(bookPartial);
        newBook.genres = genreEntities;
        await this.manager.save(newBook);
    }
    async calculateNewDiscountPrice(price, discountId) {
        if (!discountId || !price) {
            return price;
        }
        const discount = await this.manager.findOne(discount_entity_1.Discount, {
            where: {
                id: discountId,
            },
            select: {
                type: true,
                value: true,
                isActive: true,
            },
        });
        if (!discount) {
            return price;
        }
        if (!discount.isActive) {
            return price;
        }
        if (discount.type === types_1.DiscountTypeEnum.FIXED) {
            return Math.max(price - discount.value, 0);
        }
        else if (discount.type === types_1.DiscountTypeEnum.PERCENTAGE) {
            return Math.max(price - (discount.value / 100) * price, 0);
        }
        else {
            return price;
        }
    }
    async update(id, book) {
        if (!id || isNaN(id)) {
            return (0, helpers_1.throwBadRequest)('Book ID is required');
        }
        const bookExists = await this.manager.findOne(book_entity_1.Book, {
            where: { id },
            select: ['id'],
            withDeleted: true,
        });
        if (!bookExists) {
            return (0, helpers_1.throwBadRequest)('Book not found');
        }
        if (book.code) {
            const bookWithCodeExists = await this.manager.findOne(book_entity_1.Book, {
                where: { code: book.code },
                select: ['id'],
            });
            if (bookWithCodeExists && bookWithCodeExists.id !== id) {
                return (0, helpers_1.throwBadRequest)('Book code already exists');
            }
        }
        const bookPartial = (0, lodash_1.pick)(book, [
            'title',
            'code',
            'description',
            'cover',
            'imageUrl',
        ]);
        if (book.amountInStock) {
            const amountInStock = Number(book.amountInStock);
            if (!isNaN(amountInStock) && amountInStock >= 0) {
                bookPartial.amountInStock = amountInStock;
            }
            else {
                return (0, helpers_1.throwBadRequest)('Invalid amount in stock');
            }
        }
        if (book.price) {
            const price = Number(book.price);
            if (!isNaN(price) && price >= 0) {
                bookPartial.price = await this.calculateNewDiscountPrice(price, bookExists.discountId);
            }
            else {
                return (0, helpers_1.throwBadRequest)('Invalid price');
            }
        }
        if (book.ageRange) {
            const bookAgeRange = String(book.ageRange).toLowerCase();
            const ageRangeExists = await this.manager.findOne(age_range_entity_1.AgeRange, {
                where: { name: bookAgeRange },
                select: ['id'],
            });
            if (ageRangeExists) {
                bookPartial.ageRangeId = ageRangeExists.id;
            }
            else {
                const newAgeRange = await this.manager.save(this.manager.create(age_range_entity_1.AgeRange, {
                    name: bookAgeRange,
                }));
                bookPartial.ageRangeId = newAgeRange.id;
            }
        }
        if (book.category) {
            const bookCategory = String(book.category).toLowerCase();
            const categoryExists = await this.manager.findOne(category_entity_1.Category, {
                where: { name: bookCategory },
                select: ['id'],
            });
            if (categoryExists) {
                bookPartial.categoryId = categoryExists.id;
            }
            else {
                const newCategory = await this.manager.save(this.manager.create(category_entity_1.Category, {
                    name: bookCategory,
                }));
                bookPartial.categoryId = newCategory.id;
            }
        }
        let genreEntities;
        if (book.genre) {
            const genres = Array.from(book.genre)
                .filter((item) => typeof item === 'string' && item.length > 0)
                .map((item) => item.trim().toLowerCase());
            genreEntities = await this.manager.find(genre_entity_1.Genre, {
                where: { name: (0, typeorm_2.In)(genres) },
                select: ['id', 'name'],
            });
            const genresToCreate = genres.filter((item) => !genreEntities.find((genre) => genre.name === item));
            if (genresToCreate.length > 0) {
                const createdGenres = (await this.manager.save(this.manager.create(genre_entity_1.Genre, genresToCreate.map((item) => ({ name: item })))));
                genreEntities.push(...createdGenres);
            }
        }
        const updatedBook = (0, lodash_1.merge)(bookExists, bookPartial);
        updatedBook.genres = genreEntities;
        await this.manager.save(updatedBook);
    }
    async getBooks({ title, code, category, ageRange, genre, cover, id, sortByPrice, }, { page, limit } = { page: 1, limit: 10 }, { userRole } = { userRole: null }) {
        page = Number(page) || 1;
        limit = Number(limit) || 10;
        page = page < 1 ? 1 : page;
        limit = limit < 1 ? 1 : limit > 100 ? 100 : limit;
        const queryBuilder = await this.manager
            .createQueryBuilder(book_entity_1.Book, 'book')
            .select([
            'book.id',
            'book.title',
            'book.imageUrl',
            'book.code',
            'book.description',
            'book.cover',
            'book.amountInStock',
            'book.createdAt',
            'book.discountPrice',
            'book.price',
        ])
            .leftJoinAndSelect('book.genres', 'genres')
            .leftJoinAndSelect('book.category', 'category')
            .leftJoinAndSelect('book.ageRange', 'ageRange')
            .leftJoinAndSelect('book.discount', 'discount')
            .orderBy('book.createdAt', 'DESC')
            .limit(limit)
            .offset((page - 1) * limit);
        if (userRole === types_1.AppAccessLevelsEnum.ADMIN ||
            userRole === types_1.AppAccessLevelsEnum.SUPERADMIN) {
            queryBuilder.addSelect(['book.deletedAt', 'book.updatedAt']);
            queryBuilder.withDeleted();
        }
        if (id) {
            queryBuilder.andWhere('book.id = :id', { id });
        }
        if (title) {
            if (title.length < 3) {
                return [];
            }
            queryBuilder.andWhere('book.title ILike :title', { title: `%${title}%` });
        }
        if (code) {
            queryBuilder.andWhere('book.code = :code', { code });
        }
        if (category) {
            queryBuilder.andWhere('category.name = :category', { category });
        }
        if (ageRange) {
            queryBuilder.andWhere('ageRange.name = :ageRange', { ageRange });
        }
        if (genre) {
            queryBuilder.andWhere('genres.name = :genre', { genre });
        }
        if (cover) {
            queryBuilder.andWhere('book.cover = :cover', { cover });
        }
        if (sortByPrice) {
            if (sortByPrice === types_1.SortByPriceEnum.ASCENDING) {
                queryBuilder.orderBy('book.price', 'ASC');
                queryBuilder.addOrderBy('book.discountPrice', 'ASC', 'NULLS LAST');
            }
            else if (sortByPrice === types_1.SortByPriceEnum.DESCENDING) {
                queryBuilder.orderBy('book.price', 'DESC');
                queryBuilder.addOrderBy('book.discountPrice', 'DESC', 'NULLS LAST');
            }
        }
        const books = await queryBuilder.getMany();
        const response = [];
        for await (const book of books) {
            response.push({
                id: book.id,
                title: book.title,
                code: book.code,
                description: book.description,
                cover: book.cover,
                amountInStock: book.amountInStock,
                discountPrice: book.discountPrice,
                price: book.price,
                imageUrl: book.imageUrl,
                createdAt: book.createdAt,
                category: book.category?.name || null,
                ageRange: book.ageRange?.name || null,
                genres: book.genres?.map((genre) => genre.name) || [],
                discount: (book.discount && {
                    name: book.discount?.name || null,
                    type: book.discount?.type || null,
                    value: book.discount?.value || null,
                    isActive: book.discount?.isActive || null,
                }) ||
                    null,
                ...(userRole === types_1.AppAccessLevelsEnum.ADMIN ||
                    userRole === types_1.AppAccessLevelsEnum.SUPERADMIN
                    ? {
                        updatedAt: book.updatedAt,
                        isDisabled: !!book.deletedAt,
                    }
                    : {}),
            });
        }
        return response;
    }
    async getBook(id, { userRole } = { userRole: null }) {
        const book = await this.getBooks({ id }, { page: 1, limit: 1 }, { userRole });
        if (!book?.length) {
            return null;
        }
        return book[0];
    }
    async toggle(id, { enabled }) {
        if (!id || isNaN(id)) {
            return (0, helpers_1.throwBadRequest)('Book ID is required');
        }
        const bookExists = await this.manager.findOne(book_entity_1.Book, {
            where: { id },
            select: ['id'],
            withDeleted: true,
        });
        if (!bookExists) {
            return (0, helpers_1.throwBadRequest)('Book not found');
        }
        if (enabled) {
            await this.manager.restore(book_entity_1.Book, { id });
        }
        else {
            await this.manager.softDelete(book_entity_1.Book, { id });
        }
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], BookService);
//# sourceMappingURL=books.service.js.map