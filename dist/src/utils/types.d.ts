export declare enum AppAccessLevelsEnum {
    USER = "user",
    ADMIN = "admin",
    SUPERADMIN = "superadmin"
}
export declare enum MessageTypesEnum {
    BANNER = "banner_message"
}
export declare enum BookCoversEnum {
    HARDCOVER = "hardcover",
    PAPERBACK = "paperback",
    EBOOK = "ebook"
}
export declare enum SortByPriceEnum {
    ASCENDING = "ascending",
    DESCENDING = "descending"
}
export declare enum DiscountTypeEnum {
    FIXED = "fixed",
    PERCENTAGE = "percentage"
}
export declare enum DiscountCategoryEnum {
    GIFT = "gift",
    COUPON = "coupon",
    GENERAL = "general",
    FREE_SHIPPING = "free_shipping",
    GLOBAL = "global"
}
export declare enum CouponTypeEnum {
    MINIMUM_PRICE = "minimum_price",
    MINIMUM_QUANTITY = "minimum_quantity"
}
export declare enum DeliveryTypeEnum {
    PICKUP = "pickup",
    DELIVERY = "delivery"
}
export declare enum PaymentStatusEnum {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
    REVERSED = "reversed"
}
export interface FeesSplit {
    paystack: number;
    integration: number | string;
    subaccount: number;
    params: {
        bearer: string;
        transaction_charge: string | number;
        percentage_charge: string | number;
    };
}
