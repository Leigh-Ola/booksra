export enum AppAccessLevelsEnum {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
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
  GIFT = 'gift',
  COUPON = 'coupon',
  GENERAL = 'general',
  FREE_SHIPPING = 'free_shipping',
}

export enum CouponTypeEnum {
  MINIMUM_PRICE = 'minimum_price',
  MINIMUM_QUANTITY = 'minimum_quantity',
}
