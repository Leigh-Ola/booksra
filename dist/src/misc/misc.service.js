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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const email_entity_1 = require("./email.entity");
const message_entity_1 = require("./message.entity");
const helpers_1 = require("../utils/helpers");
const contact_us_1 = require("../mail/templates/contact-us");
const mail_service_1 = require("../mail/mail.service");
let MiscService = class MiscService {
    constructor(dbSource) {
        this.dbSource = dbSource;
        this.manager = this.dbSource.manager;
    }
    async sendEmail(ip, body) {
        const lastEmail = await this.manager.findOne(email_entity_1.Email, {
            where: { ip },
            order: { createdAt: 'DESC' },
        });
        const { SITE_ADMIN_EMAIL, EMAIL_MIN_INTERVAL, NODE_ENV } = process.env;
        if (lastEmail) {
            const emailMinInterval = NODE_ENV === 'production' ? Number(EMAIL_MIN_INTERVAL) : 1;
            const lastEmailTime = lastEmail.updatedAt;
            const now = new Date();
            const timeDiff = now.getTime() - lastEmailTime.getTime();
            const minutesPassed = Math.floor(timeDiff / 1000 / 60);
            if (minutesPassed < emailMinInterval) {
                return (0, helpers_1.throwBadRequest)(`You have sent an email recently. Please wait ${emailMinInterval} minute(s) before sending another email.`);
            }
        }
        const email = new email_entity_1.Email();
        email.ip = ip;
        email.name = body.name;
        email.email = body.email;
        email.message = body.message;
        if (body.company) {
            email.company = body.company;
        }
        await this.manager.save(email);
        const template = (0, contact_us_1.contactUsTemplate)({
            recipient: SITE_ADMIN_EMAIL,
            subject: 'A customer just sent you a message on your website',
            data: {
                name: body.name,
                email: body.email,
                message: body.message,
                company: body.company || '',
            },
        });
        (0, mail_service_1.sendMail)(template).catch((err) => {
            console.log(err);
        });
        return;
    }
    async updateMessage(body) {
        let message = await this.manager.findOne(message_entity_1.Message, {
            where: { type: body.type },
        });
        if (!message) {
            message = new message_entity_1.Message();
            message.type = body.type;
        }
        message.message = body.message;
        const savedMessage = await this.manager.save(message);
        console.log(savedMessage);
    }
    async getMessage(type) {
        const message = await this.manager.findOne(message_entity_1.Message, {
            where: { type },
        });
        return message;
    }
};
exports.MiscService = MiscService;
exports.MiscService = MiscService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MiscService);
//# sourceMappingURL=misc.service.js.map