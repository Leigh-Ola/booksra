import { Book } from '../books/book.entity';
import { DiscountTypeEnum } from '../utils/types';
export declare class Discount {
    id: number;
    name: string;
    couponCode: string;
    type: DiscountTypeEnum;
    value: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    books: Book[];
}
