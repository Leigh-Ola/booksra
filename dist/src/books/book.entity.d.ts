import { BookCoversEnum } from '../utils/types';
import { Genre } from './genre.entity';
import { Category } from './category.entity';
import { AgeRange } from './age-range.entity';
import { Discount } from '../discount/discount.entity';
export declare class Book {
    id: number;
    title: string | null;
    imageUrl: string;
    code: string;
    description: string | null;
    cover: BookCoversEnum | null;
    amountInStock: number;
    createdAt: Date;
    updatedAt: Date;
    discountPrice: number | null;
    price: number;
    discountId: number | null;
    categoryId: number | null;
    ageRangeId: number | null;
    genres: Genre[];
    category: Category;
    ageRange: AgeRange;
    discount: Discount;
}
