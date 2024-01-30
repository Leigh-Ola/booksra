import { BookService } from './books.service';
import {
  Post,
  Put,
  Param,
  UseGuards,
  Body,
  Query,
  Controller,
  Get,
  Request,
} from '@nestjs/common';
import { IsAdminUser, IsAnyone } from '../users/users-guard';
import { CreateBookDto, UpdateBookDto, GetBooksDto } from './dto/books-dto';
import { BookCoversEnum, SortByPriceEnum } from '../utils/types';

@Controller('book')
export class BookController {
  constructor(private readonly booksService: BookService) {}

  // create book
  @Post()
  @UseGuards(IsAdminUser)
  async create(@Body() book: CreateBookDto) {
    return this.booksService.create(book);
  }

  // update book
  @Put(':id')
  @UseGuards(IsAdminUser)
  async update(@Param('id') id: number, @Body() data: UpdateBookDto) {
    return this.booksService.update(id, data);
  }

  // get all matched books
  @Get()
  @UseGuards(IsAnyone)
  async findAll(@Request() req, @Query() query: GetBooksDto) {
    const userRole = req.user?.role;
    return this.booksService.getBooks(
      {
        title: query.title,
        code: query.code,
        genre: query.genre,
        category: query.category,
        ageRange: query.ageRange,
        cover: query.cover,
        sortByPrice: query.sortByPrice,
      },
      {
        page: query.page,
        limit: query.limit,
      },
      {
        userRole,
      },
    );
  }

  // get specific book by id
  @Get(':id')
  @UseGuards(IsAnyone)
  async findOne(@Param('id') id: number, @Request() req) {
    const userRole = req.user?.role;
    return this.booksService.getBook(id, {
      userRole,
    });
  }

  // enable or disable a book
  @Post(':id/toggle')
  @UseGuards(IsAdminUser)
  async toggle(@Param('id') id: number, @Body() data: { enabled: boolean }) {
    return this.booksService.toggle(id, data);
  }
}
