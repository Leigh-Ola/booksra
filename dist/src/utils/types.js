"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponTypeEnum = exports.DiscountCategoryEnum = exports.DiscountTypeEnum = exports.BookCoversEnum = exports.AppAccessLevelsEnum = void 0;
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
var DiscountTypeEnum;
(function (DiscountTypeEnum) {
    DiscountTypeEnum["FIXED"] = "fixed";
    DiscountTypeEnum["PERCENTAGE"] = "percentage";
})(DiscountTypeEnum || (exports.DiscountTypeEnum = DiscountTypeEnum = {}));
var DiscountCategoryEnum;
(function (DiscountCategoryEnum) {
    DiscountCategoryEnum["GIFT"] = "gift";
    DiscountCategoryEnum["COUPON"] = "coupon";
    DiscountCategoryEnum["DISCOUNT"] = "discount";
})(DiscountCategoryEnum || (exports.DiscountCategoryEnum = DiscountCategoryEnum = {}));
var CouponTypeEnum;
(function (CouponTypeEnum) {
    CouponTypeEnum["MINIMUM_PRICE"] = "minimum_price";
    CouponTypeEnum["MINIMUM_QUANTITY"] = "minimum_quantity";
    CouponTypeEnum["FREE_SHIPPING"] = "free_shipping";
})(CouponTypeEnum || (exports.CouponTypeEnum = CouponTypeEnum = {}));
//# sourceMappingURL=types.js.map