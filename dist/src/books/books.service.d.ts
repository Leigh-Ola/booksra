import { Repository, DataSource, EntityManager } from 'typeorm';
import { Book } from './book.entity';
import { BookCoversEnum } from '../utils/types';
import { UpdateBookDto, CreateBookDto } from './dto/books-dto';
export declare class BookService {
    private bookRepository;
    private dbSource;
    manager: EntityManager;
    constructor(bookRepository: Repository<Book>, dbSource: DataSource);
    private removeNestedFields;
    create(book: CreateBookDto): Promise<never>;
    private calculateNewDiscountPrice;
    update(id: number, book: UpdateBookDto): Promise<never>;
    getBooks({ title, code, category, ageRange, genre, cover, }: {
        title?: string;
        code?: string;
        category?: string;
        ageRange?: string;
        genre?: string;
        cover?: BookCoversEnum;
    }, { page, limit }?: {
        page?: number;
        limit?: number;
    }): Promise<any[]>;
}
