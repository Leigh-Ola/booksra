import { DiscountTypeEnum } from '../../utils/types';
export declare class CreateDiscountDto {
    name: string;
    couponCode?: string;
    type: DiscountTypeEnum;
    value: number;
    startDate: Date;
    endDate: Date;
    bookIds: number[];
}
export declare class UpdateDiscountDto {
    name?: string;
    couponCode?: string;
    type?: DiscountTypeEnum;
    value?: number;
    startDate?: Date;
    endDate?: Date;
    bookIds?: number[];
}
