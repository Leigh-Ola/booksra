import { Repository, DataSource, EntityManager } from 'typeorm';
import { Book } from './book.entity';
import { BookCoversEnum, SortByPriceEnum } from '../utils/types';
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
    getBooks({ title, code, category, ageRange, genre, cover, id, sortByPrice, }: {
        title?: string;
        code?: string;
        category?: string;
        ageRange?: string;
        genre?: string;
        cover?: BookCoversEnum;
        id?: number;
        sortByPrice?: SortByPriceEnum;
    }, { page, limit }?: {
        page?: number;
        limit?: number;
    }, { userRole }?: {
        userRole?: string;
    }): Promise<any[]>;
    getBook(id: number, { userRole }?: {
        userRole?: string;
    }): Promise<any>;
    toggle(id: number, { enabled }: {
        enabled: boolean;
    }): Promise<never>;
}
