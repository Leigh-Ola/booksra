import { BookService } from './books.service';
import {
  Post,
  Put,
  UseGuards,
  Body,
  Query,
  Controller,
  Get,
} from '@nestjs/common';
import { IsAdminUser } from '../users/users-guard';
import { CreateBookDto } from './dto/books-dto';
import { BookCoversEnum } from '../utils/types';

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
  @Put()
  @UseGuards(IsAdminUser)
  async update(@Body() { id, data }: { id: number; data: CreateBookDto }) {
    return this.booksService.update(id, data);
  }

  // get all matched books
  @Get()
  async findAll(
    @Query('title') title: string,
    @Query('code') code: string,
    @Query('genre') genre: string,
    @Query('category') category: string,
    @Query('ageRange') ageRange: string,
    @Query('cover') cover: BookCoversEnum,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.booksService.getBooks(
      {
        title,
        code,
        genre,
        category,
        ageRange,
        cover,
      },
      {
        page,
        limit,
      },
    );
  }
}
