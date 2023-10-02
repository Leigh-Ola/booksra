"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryTypeEnum = exports.CouponTypeEnum = exports.DiscountCategoryEnum = exports.DiscountTypeEnum = exports.SortByPriceEnum = exports.BookCoversEnum = exports.AppAccessLevelsEnum = void 0;
var AppAccessLevelsEnum;
(function (AppAccessLevelsEnum) {
    AppAccessLevelsEnum["USER"] = "user";
    AppAccessLevelsEnum["ADMIN"] = "admin";
    AppAccessLevelsEnum["SUPERADMIN"] = "superadmin";
})(AppAccessLevelsEnum || (exports.AppAccessLevelsEnum = AppAccessLevelsEnum = {}));
var BookCoversEnum;
(function (BookCoversEnum) {
    BookCoversEnum["HARDCOVER"] = "hardcover";
    BookCoversEnum["PAPERBACK"] = "paperback";
    BookCoversEnum["EBOOK"] = "ebook";
})(BookCoversEnum || (exports.BookCoversEnum = BookCoversEnum = {}));
var SortByPriceEnum;
(function (SortByPriceEnum) {
    SortByPriceEnum["ASCENDING"] = "ascending";
    SortByPriceEnum["DESCENDING"] = "descending";
})(SortByPriceEnum || (exports.SortByPriceEnum = SortByPriceEnum = {}));
var DiscountTypeEnum;
(function (DiscountTypeEnum) {
    DiscountTypeEnum["FIXED"] = "fixed";
    DiscountTypeEnum["PERCENTAGE"] = "percentage";
})(DiscountTypeEnum || (exports.DiscountTypeEnum = DiscountTypeEnum = {}));
var DiscountCategoryEnum;
(function (DiscountCategoryEnum) {
    DiscountCategoryEnum["GIFT"] = "gift";
    DiscountCategoryEnum["COUPON"] = "coupon";
    DiscountCategoryEnum["GENERAL"] = "general";
    DiscountCategoryEnum["FREE_SHIPPING"] = "free_shipping";
    DiscountCategoryEnum["GLOBAL"] = "global";
})(DiscountCategoryEnum || (exports.DiscountCategoryEnum = DiscountCategoryEnum = {}));
var CouponTypeEnum;
(function (CouponTypeEnum) {
    CouponTypeEnum["MINIMUM_PRICE"] = "minimum_price";
    CouponTypeEnum["MINIMUM_QUANTITY"] = "minimum_quantity";
})(CouponTypeEnum || (exports.CouponTypeEnum = CouponTypeEnum = {}));
var DeliveryTypeEnum;
(function (DeliveryTypeEnum) {
    DeliveryTypeEnum["PICKUP"] = "pickup";
    DeliveryTypeEnum["DELIVERY"] = "delivery";
})(DeliveryTypeEnum || (exports.DeliveryTypeEnum = DeliveryTypeEnum = {}));
//# sourceMappingURL=types.js.map