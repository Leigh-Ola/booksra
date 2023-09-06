import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, In, ILike } from 'typeorm';
import { Book } from './book.entity';
import { Discount } from '../discount/discount.entity';
import { AgeRange } from './age-range.entity';
import { Category } from './category.entity';
import { Genre } from './genre.entity';
import { omit, pick, merge } from 'lodash';
import { throwBadRequest } from '../utils/helpers';
// import string generator
import { generateRandomString } from '../utils/helpers';
import { BookCoversEnum, DiscountTypeEnum } from '../utils/types';
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
    }: {
      title?: string;
      code?: string;
      category?: string;
      ageRange?: string;
      genre?: string;
      cover?: BookCoversEnum;
    },
    { page, limit }: { page?: number; limit?: number } = { page: 1, limit: 10 },
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
        'book.code',
        'book.description',
        'book.cover',
        'book.amountInStock',
        'book.discountPrice',
        'book.price',
        'book.imageUrl',
        'book.createdAt',
      ])
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.ageRange', 'ageRange')
      .leftJoinAndSelect('book.genres', 'genre')
      .leftJoinAndSelect('book.discount', 'discount')
      .orderBy('book.createdAt', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    if (title) {
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
      });
    }
    return response;
  }
}
