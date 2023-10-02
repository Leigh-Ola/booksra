"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPostGresUTC = exports.generateRandomNumberString = exports.generateRandomString = exports.throwUnauthorized = exports.throwBadRequest = void 0;
const common_1 = require("@nestjs/common");
const throwBadRequest = (message) => {
    throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
};
exports.throwBadRequest = throwBadRequest;
const throwUnauthorized = (message) => {
    throw new common_1.HttpException(message, common_1.HttpStatus.UNAUTHORIZED);
};
exports.throwUnauthorized = throwUnauthorized;
const generateRandomString = (n) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
};
exports.generateRandomString = generateRandomString;
const generateRandomNumberString = (n) => {
    const chars = '0123456789';
    let token = '';
    for (let i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
};
exports.generateRandomNumberString = generateRandomNumberString;
const toPostGresUTC = (date) => {
    const date_ = date.toISOString().replace('T', ' ').replace('Z', '');
    return date_.substring(0, date_.indexOf('.')).trim() + '+00';
};
exports.toPostGresUTC = toPostGresUTC;
//# sourceMappingURL=helpers.js.map