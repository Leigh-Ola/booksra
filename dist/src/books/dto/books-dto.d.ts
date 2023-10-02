import { BookCoversEnum } from '../../utils/types';
export declare class CreateBookDto {
    title?: string;
    imageUrl: string;
    code: string;
    description?: string;
    cover?: BookCoversEnum;
    amountInStock?: number;
    price: number;
    genre?: string[];
    category?: string;
    ageRange?: string;
}
export declare class UpdateBookDto {
    title?: string;
    imageUrl?: string;
    code?: string;
    description?: string;
    cover?: BookCoversEnum;
    amountInStock?: number;
    price: number;
    genre?: string[];
    category?: string;
    ageRange?: string;
}
