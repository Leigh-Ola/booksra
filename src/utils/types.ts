export enum AppAccessLevelsEnum {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export enum MessageTypesEnum {
  BANNER = 'banner_message',
}

export enum BookCoversEnum {
  HARDCOVER = 'hardcover',
  PAPERBACK = 'paperback',
  EBOOK = 'ebook',
}

export enum SortByPriceEnum {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export enum DiscountTypeEnum {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

export enum DiscountCategoryEnum {
  GIFT = 'gift', // include gift details in mail to admin
  COUPON = 'coupon', // apply when coupon code is provided
  GENERAL = 'general', // apply when a book in the discount is purchased
  FREE_SHIPPING = 'free_shipping', // annul delivery fee
  GLOBAL = 'global', // apply to any purchase, if requirements are met
}

export enum CouponTypeEnum {
  MINIMUM_PRICE = 'minimum_price',
  MINIMUM_QUANTITY = 'minimum_quantity',
}

export enum DeliveryTypeEnum {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export enum PaymentStatusEnum {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REVERSED = 'reversed',
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

export enum EmailTypeEnum {
  CONTACT_US = 'contact_us',
  PURCHASE = 'purchase',
  OTHER = 'other',
}

export enum EmailStatusEnum {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}
