"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountTypeEnum = exports.BookCoversEnum = exports.AppAccessLevelsEnum = void 0;
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
//# sourceMappingURL=types.js.map