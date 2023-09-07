import { EntityManager, DataSource } from 'typeorm';
import { Discount } from './discount.entity';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount-dto';
export declare class DiscountService {
    private dbSource;
    manager: EntityManager;
    constructor(dbSource: DataSource);
    private isDatePassed;
    create(discountDto: CreateDiscountDto): Promise<never>;
    update(id: number, discountDto: UpdateDiscountDto): Promise<never>;
    private updateBooks;
    find({ page, limit, query, }?: {
        page: number;
        limit: number;
        query: string;
    }): Promise<Discount[]>;
    delete(id: number): Promise<never>;
}
