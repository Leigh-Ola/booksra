import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, In } from 'typeorm';
import { Book } from './book.entity';
import { Discount } from '../discount/discount.entity';
import { AgeRange } from './age-range.entity';
import { Category } from './category.entity';
import { Genre } from './genre.entity';
import { omit, pick, merge } from 'lodash';
import { throwBadRequest } from '../utils/helpers';
// import string generator
import {
  BookCoversEnum,
  DiscountTypeEnum,
  SortByPriceEnum,
  AppAccessLevelsEnum,
} from '../utils/types';
import { UpdateBookDto, CreateBookDto } from './dto/books-dto';

@Injectable()
export class BookService {
  manager: EntityManager;
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private dbSource: DataSource,
  ) {
    this.manager = this.dbSource.manager;
  }

  private removeNestedFields(collection: any[], fields: string[]) {
    return collection.map((item) => {
      return omit(item, fields);
    });
  }

  // function to create a book
  async create(book: CreateBookDto) {
    if (!book.code || !book.imageUrl || !book.price || !book.amountInStock) {
      return throwBadRequest(
        'Book code, image, price and amount in stock are required',
      );
    }
    // make sure another book with the same code doesn't exist
    const bookWithCodeExists = await this.manager.findOne(Book, {
      where: { code: book.code },
      select: ['id'],
      withDeleted: true,
    });
    if (bookWithCodeExists) {
      return throwBadRequest('Book code already exists');
    }
    const bookPartial = pick(book, [
      'title',
      'code',
      'description',
      'cover',
      'imageUrl',
    ]) as Partial<Book> & {
      ageRangeId?: number;
      categoryId?: number;
      genreId?: number;
    };
    // validate amount in stock
    const amountInStock = Number(book.amountInStock);
    if (!isNaN(amountInStock) && amountInStock >= 0) {
      bookPartial.amountInStock = amountInStock;
    } else {
      return throwBadRequest('Invalid amount in stock');
    }
    // validate price
    const price = Number(book.price);
    if (!isNaN(price) && price >= 0) {
      bookPartial.price = price;
    } else {
      return throwBadRequest('Invalid price');
    }
    // first create the age range if it was provided
    if (book.ageRange) {
      const bookAgeRange = String(book.ageRange).toLowerCase();
      const ageRangeExists = await this.manager.findOne(AgeRange, {
        where: { name: bookAgeRange },
        select: ['id'],
      });
      if (ageRangeExists) {
        bookPartial.ageRangeId = ageRangeExists.id;
      } else {
        const newAgeRange = await this.manager.save(
          this.manager.create(AgeRange, {
            name: bookAgeRange,
          }),
        );
        bookPartial.ageRangeId = newAgeRange.id;
      }
    }
    // then create the category if it was provided
    if (book.category) {
      const bookCategory = String(book.category).toLowerCase();
      const categoryExists = await this.manager.findOne(Category, {
        where: { name: bookCategory },
        select: ['id'],
      });
      if (categoryExists) {
        bookPartial.categoryId = categoryExists.id;
      } else {
        const newCategory = await this.manager.save(
          this.manager.create(Category, {
            name: bookCategory,
          }),
        );
        bookPartial.categoryId = newCategory.id;
      }
    }
    // then create the genre(s) if it was provided
    let genreEntities: Genre[];
    if (book.genre) {
      const genres = Array.from(book.genre)
        .filter((item) => typeof item === 'string' && item.length > 0)
        .map((item) => (item as string).trim().toLowerCase());
      genreEntities = await this.manager.find(Genre, {
        where: { name: In(genres) },
        select: ['id', 'name'],
      });
      const genresToCreate = genres.filter(
        (item) => !genreEntities.find((genre) => genre.name === item),
      );
      if (genresToCreate.length > 0) {
        const createdGenres = (await this.manager.save(
          this.manager.create(
            Genre,
            genresToCreate.map((item) => ({ name: item })),
          ),
        )) as Genre[];
        genreEntities.push(...createdGenres);
      }
    }
    // bookPartial.code = generateRandomString(10);
    const newBook = this.bookRepository.create(bookPartial);
    newBook.genres = genreEntities;
    await this.manager.save(newBook);
  }

  private async calculateNewDiscountPrice(
    price: number | null,
    discountId: number | null,
  ) {
    if (!discountId || !price) {
      return price;
    }
    const discount = await this.manager.findOne(Discount, {
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
    if (discount.type === DiscountTypeEnum.FIXED) {
      // do the math. never below 0
      return Math.max(price - discount.value, 0);
    } else if (discount.type === DiscountTypeEnum.PERCENTAGE) {
      // do the math. subtract discount.value percent from discountPrice
      return Math.max(price - (discount.value / 100) * price, 0);
    } else {
      return price;
    }
  }

  // update book
  async update(id: number, book: UpdateBookDto) {
    if (!id || isNaN(id)) {
      return throwBadRequest('Book ID is required');
    }
    // make sure the book exists
    const bookExists = await this.manager.findOne(Book, {
      where: { id },
      select: ['id'],
      withDeleted: true,
    });
    if (!bookExists) {
      return throwBadRequest('Book not found');
    }
    if (book.code) {
      // make sure another book with the same code doesn't exist
      const bookWithCodeExists = await this.manager.findOne(Book, {
        where: { code: book.code },
        select: ['id'],
      });
      if (bookWithCodeExists && bookWithCodeExists.id !== id) {
        return throwBadRequest('Book code already exists');
      }
    }
    const bookPartial = pick(book, [
      'title',
      'code',
      'description',
      'cover',
      'imageUrl',
    ]) as Partial<Book> & {
      ageRangeId?: number;
      categoryId?: number;
      genreId?: number;
    };
    // validate amount in stock if it was provided
    if (book.amountInStock) {
      const amountInStock = Number(book.amountInStock);
      if (!isNaN(amountInStock) && amountInStock >= 0) {
        bookPartial.amountInStock = amountInStock;
      } else {
        return throwBadRequest('Invalid amount in stock');
      }
    }
    // validate price if it was provided
    if (book.price) {
      const price = Number(book.price);
      if (!isNaN(price) && price >= 0) {
        bookPartial.price = await this.calculateNewDiscountPrice(
          price,
          bookExists.discountId,
        );
      } else {
        return throwBadRequest('Invalid price');
      }
    }
    // first create the age range if it was provided
    if (book.ageRange) {
      const bookAgeRange = String(book.ageRange).toLowerCase();
      const ageRangeExists = await this.manager.findOne(AgeRange, {
        where: { name: bookAgeRange },
        select: ['id'],
      });
      if (ageRangeExists) {
        bookPartial.ageRangeId = ageRangeExists.id;
      } else {
        const newAgeRange = await this.manager.save(
          this.manager.create(AgeRange, {
            name: bookAgeRange,
          }),
        );
        bookPartial.ageRangeId = newAgeRange.id;
      }
    }
    // then create the category if it was provided
    if (book.category) {
      const bookCategory = String(book.category).toLowerCase();
      const categoryExists = await this.manager.findOne(Category, {
        where: { name: bookCategory },
        select: ['id'],
      });
      if (categoryExists) {
        bookPartial.categoryId = categoryExists.id;
      } else {
        const newCategory = await this.manager.save(
          this.manager.create(Category, {
            name: bookCategory,
          }),
        );
        bookPartial.categoryId = newCategory.id;
      }
    }
    // then create the genre(s) if it was provided
    let genreEntities: Genre[];
    if (book.genre) {
      const genres = Array.from(book.genre)
        .filter((item) => typeof item === 'string' && item.length > 0)
        .map((item) => (item as string).trim().toLowerCase());
      genreEntities = await this.manager.find(Genre, {
        where: { name: In(genres) },
        select: ['id', 'name'],
      });
      const genresToCreate = genres.filter(
        (item) => !genreEntities.find((genre) => genre.name === item),
      );
      if (genresToCreate.length > 0) {
        const createdGenres = (await this.manager.save(
          this.manager.create(
            Genre,
            genresToCreate.map((item) => ({ name: item })),
          ),
        )) as Genre[];
        genreEntities.push(...createdGenres);
      }
    }
    // update bookExists with bookPartial
    const updatedBook = merge(bookExists, bookPartial);
    updatedBook.genres = genreEntities;

    await this.manager.save(updatedBook);
  }

  // function to get a book by title, code, category or age range
  async getBooks(
    {
      title,
      code,
      category,
      ageRange,
      genre,
      cover,
      id,
      sortByPrice,
    }: {
      title?: string;
      code?: string;
      category?: string;
      ageRange?: string;
      genre?: string;
      cover?: BookCoversEnum;
      id?: number;
      sortByPrice?: SortByPriceEnum;
    },
    { page, limit }: { page?: number; limit?: number } = { page: 1, limit: 10 },
    { userRole }: { userRole?: string } = { userRole: null },
  ) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 1 : limit > 100 ? 100 : limit;
    const queryBuilder = await this.manager
      .createQueryBuilder(Book, 'book')
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
      .orderBy('book.createdAt', 'DESC') // this sorts from newest to oldest
      .limit(limit)
      .offset((page - 1) * limit);

    if (
      userRole === AppAccessLevelsEnum.ADMIN ||
      userRole === AppAccessLevelsEnum.SUPERADMIN
    ) {
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
      queryBuilder.andWhere('LOWER("category"."name") = :category', {
        category: String(category).toLowerCase(),
      });
    }

    if (ageRange) {
      queryBuilder.andWhere('LOWER("ageRange"."name") = :ageRange', {
        ageRange: String(ageRange).toLowerCase(),
      });
    }

    if (genre) {
      queryBuilder.andWhere('LOWER("genres"."name") = :genre', {
        genre: String(genre).toLowerCase(),
      });
    }

    if (cover) {
      queryBuilder.andWhere('book.cover = :cover', { cover });
    }

    if (sortByPrice) {
      if (sortByPrice === SortByPriceEnum.ASCENDING) {
        queryBuilder.orderBy('book.price', 'ASC');
        // if discountPrice is not null, order by discountPrice
        queryBuilder.addOrderBy('book.discountPrice', 'ASC', 'NULLS LAST');
      } else if (sortByPrice === SortByPriceEnum.DESCENDING) {
        queryBuilder.orderBy('book.price', 'DESC');
        // if discountPrice is not null, order by discountPrice
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
        discount:
          (book.discount && {
            name: book.discount?.name || null,
            type: book.discount?.type || null,
            value: book.discount?.value || null,
            isActive: book.discount?.isActive || null,
          }) ||
          null,
        ...(userRole === AppAccessLevelsEnum.ADMIN ||
        userRole === AppAccessLevelsEnum.SUPERADMIN
          ? {
              updatedAt: book.updatedAt,
              isDisabled: !!book.deletedAt,
            }
          : {}),
      });
    }
    return response;
  }

  // get a single book
  async getBook(
    id: number,
    { userRole }: { userRole?: string } = { userRole: null },
  ) {
    const book = await this.getBooks(
      { id },
      { page: 1, limit: 1 },
      { userRole },
    );
    if (!book?.length) {
      return null;
    }
    return book[0];
  }

  // toogle book availability with soft delete, depending on { enabled: boolean }
  async toggle(id: number, { enabled }: { enabled: boolean }) {
    if (!id || isNaN(id)) {
      return throwBadRequest('Book ID is required');
    }
    // make sure the book exists
    const bookExists = await this.manager.findOne(Book, {
      where: { id },
      select: ['id'],
      withDeleted: true,
    });
    if (!bookExists) {
      return throwBadRequest('Book not found');
    }
    if (enabled) {
      // enable book
      await this.manager.restore(Book, { id });
    } else {
      // disable book
      await this.manager.softDelete(Book, { id });
    }
  }
}
