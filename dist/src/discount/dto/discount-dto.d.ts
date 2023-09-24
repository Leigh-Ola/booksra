import { DiscountTypeEnum, DiscountCategoryEnum, CouponTypeEnum } from '../../utils/types';
export declare class CreateDiscountDto {
    name: string;
    value: number;
    startDate: Date;
    endDate: Date;
    type: DiscountTypeEnum;
    category: DiscountCategoryEnum;
    bookIds?: number[];
    couponCode?: string;
    couponType?: CouponTypeEnum;
    couponMinValue?: number;
}
export declare class UpdateDiscountDto {
    name?: string;
    value?: number;
    startDate?: Date;
    endDate?: Date;
    type?: DiscountTypeEnum;
    bookIds?: number[];
    couponCode?: string;
    couponType?: CouponTypeEnum;
    couponMinValue?: number;
}
