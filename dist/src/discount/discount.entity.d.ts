import { Book } from '../books/book.entity';
import { DiscountTypeEnum, DiscountCategoryEnum, CouponTypeEnum } from '../utils/types';
export declare class Discount {
    id: number;
    name: string;
    couponCode: string;
    type: DiscountTypeEnum;
    category: DiscountCategoryEnum;
    couponType: CouponTypeEnum;
    couponMinValue: number;
    value: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    books: Book[];
}
