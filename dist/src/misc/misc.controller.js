"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscController = void 0;
const common_1 = require("@nestjs/common");
const misc_service_1 = require("./misc.service");
const misc_dto_1 = require("./dto/misc-dto");
const types_1 = require("../utils/types");
let MiscController = class MiscController {
    constructor(miscService) {
        this.miscService = miscService;
    }
    async getGenre(body, ip) {
        return this.miscService.sendEmail(ip, body);
    }
    async updateMessage(body) {
        return this.miscService.updateMessage(body);
    }
    async getMessage(type) {
        return this.miscService.getMessage(type);
    }
};
exports.MiscController = MiscController;
__decorate([
    (0, common_1.Post)('/contact-us'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [misc_dto_1.ContactMessageDto, String]),
    __metadata("design:returntype", Promise)
], MiscController.prototype, "getGenre", null);
__decorate([
    (0, common_1.Post)('/message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [misc_dto_1.UpdateMessageDto]),
    __metadata("design:returntype", Promise)
], MiscController.prototype, "updateMessage", null);
__decorate([
    (0, common_1.Get)('/message'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MiscController.prototype, "getMessage", null);
exports.MiscController = MiscController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [misc_service_1.MiscService])
], MiscController);
//# sourceMappingURL=misc.controller.js.map