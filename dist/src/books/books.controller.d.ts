import { BookService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/books-dto';
import { BookCoversEnum } from '../utils/types';
export declare class BookController {
    private readonly booksService;
    constructor(booksService: BookService);
    create(book: CreateBookDto): Promise<never>;
    update(id: number, data: UpdateBookDto): Promise<never>;
    findAll(title: string, code: string, genre: string, category: string, ageRange: string, cover: BookCoversEnum, page?: number, limit?: number): Promise<any[]>;
}
