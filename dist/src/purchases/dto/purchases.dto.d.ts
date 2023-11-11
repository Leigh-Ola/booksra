import { DeliveryTypeEnum } from '../../utils/types';
declare class BookDto {
    bookId: string;
    quantity: string;
}
export declare class CalculatePurchaseDto {
    books: BookDto[];
    couponCode?: string;
    notes?: string;
    deliveryType?: DeliveryTypeEnum;
    locationId?: string;
}
export declare class NewPurchaseDto {
    books: BookDto[];
    couponCode?: string;
    notes?: string;
    deliveryType: DeliveryTypeEnum;
    locationId?: string;
    callbackUrl: string;
}
export {};
