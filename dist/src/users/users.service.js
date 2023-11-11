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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const lodash_1 = require("lodash");
const bcrypt = require("bcrypt-node");
const jwt_1 = require("@nestjs/jwt");
const helpers_1 = require("../utils/helpers");
const change_password_entity_1 = require("./change-password.entity");
const forgot_password_1 = require("../mail/templates/forgot-password");
const mail_service_1 = require("../mail/mail.service");
let UserService = class UserService {
    constructor(userRepository, dbSource, jwtService) {
        this.userRepository = userRepository;
        this.dbSource = dbSource;
        this.jwtService = jwtService;
        this.manager = this.dbSource.manager;
    }
    removeNestedFields(collection, fields) {
        return collection.map((item) => {
            return (0, lodash_1.omit)(item, fields);
        });
    }
    async create(user) {
        const userExists = await this.manager.findOne(user_entity_1.User, {
            where: { email: user.email, password: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
            select: ['id'],
        });
        if (userExists) {
            return (0, helpers_1.throwBadRequest)('This email address is already taken');
        }
        user = (0, lodash_1.pick)(user, [
            'firstName',
            'lastName',
            'email',
            'phone',
            'address',
            'companyName',
            'country',
            'town',
            'state',
            'zipCode',
            'password',
        ]);
        if (typeof user.password === 'string' && user.password.length > 0) {
            user.password = bcrypt.hashSync(user.password);
        }
        else {
            user.password = null;
        }
        const newuser = await this.userRepository.save(this.userRepository.create(user));
        const payload = {
            id: Number(newuser.id),
            email: newuser.email,
            role: newuser.role,
        };
        const access_token = await this.jwtService.signAsync(payload);
        return {
            token: access_token,
        };
    }
    async login(user) {
        const userExists = await this.manager.findOne(user_entity_1.User, {
            where: {
                email: (0, typeorm_2.Raw)((em) => `LOWER(${em}) = LOWER('${user.email}')`),
                password: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
            },
            select: ['id', 'password', 'email', 'role'],
        });
        if (!userExists) {
            return (0, helpers_1.throwBadRequest)('Invalid credentials');
        }
        if (!userExists.password) {
            return (0, helpers_1.throwBadRequest)('Invalid credentials');
        }
        const isMatch = await bcrypt.compareSync(user.password, userExists.password);
        if (!isMatch) {
            return (0, helpers_1.throwBadRequest)('Invalid credentials');
        }
        const payload = {
            id: Number(userExists.id),
            email: userExists.email,
            role: userExists.role,
        };
        const access_token = await this.jwtService.signAsync(payload);
        return {
            token: access_token,
        };
    }
    async getUser({ id, email }) {
        if (!id && !email)
            return null;
        const user = await this.userRepository.findOne({
            where: {
                ...(id && { id }),
                ...(email && { email }),
            },
            relations: ['purchases'],
        });
        if (!user) {
            return (0, helpers_1.throwBadRequest)('User does not exist');
        }
        return (0, lodash_1.pick)(user, [
            'firstName',
            'lastName',
            'email',
            'phone',
            'address',
            'companyName',
            'country',
            'town',
            'state',
            'role',
            'zipCode',
        ]);
    }
    async updateUser(id, user) {
        if (!id || isNaN(id)) {
            return (0, helpers_1.throwBadRequest)('User ID is required');
        }
        const userExists = await this.manager.findOne(user_entity_1.User, {
            where: { id },
            select: ['id'],
        });
        if (!userExists) {
            return (0, helpers_1.throwBadRequest)('User does not exist');
        }
        user = (0, lodash_1.pick)(user, [
            'firstName',
            'lastName',
            'email',
            'phone',
            'address',
            'companyName',
            'country',
            'town',
            'state',
            'zipCode',
        ]);
        if (!Object.keys(user).length) {
            return;
        }
        Object.keys(user).forEach((key) => {
            if (user[key] === null || user[key] === undefined) {
                delete user[key];
            }
        });
        await this.userRepository.update(id, user);
        return;
    }
    async sendPasswordToken(email) {
        const userExists = await this.manager.findOne(user_entity_1.User, {
            where: {
                email: (0, typeorm_2.Raw)((em) => `LOWER(${em}) = LOWER('${email}')`),
                password: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
            },
            select: ['id', 'email'],
            relations: ['passwordToken'],
        });
        if (!userExists) {
            return (0, helpers_1.throwBadRequest)('User does not exist');
        }
        const token = (0, helpers_1.generateRandomNumberString)(6);
        const { NODE_ENV } = process.env;
        if (NODE_ENV === 'development') {
            console.log({ token });
        }
        const encryptedToken = bcrypt.hashSync(token);
        const passwordTokenEntry = userExists.passwordToken;
        const template = (0, forgot_password_1.forgotPasswordTemplate)({
            recipient: userExists.email,
            subject: 'Password Reset',
            data: {
                token,
            },
        });
        (0, mail_service_1.sendMail)(template);
        if (passwordTokenEntry?.id) {
            await this.manager.update(change_password_entity_1.ChangePassword, passwordTokenEntry.id, {
                token: encryptedToken,
            });
        }
        else {
            await this.manager.save(change_password_entity_1.ChangePassword, {
                token: encryptedToken,
                userId: userExists.id,
            });
        }
    }
    async resetPassword({ email, token, password, confirmPassword, }) {
        if (password !== confirmPassword) {
            return (0, helpers_1.throwBadRequest)('Passwords do not match');
        }
        const userExists = await this.manager.findOne(user_entity_1.User, {
            where: {
                email: (0, typeorm_2.Raw)((em) => `LOWER(${em}) = LOWER('${email}')`),
            },
            select: ['id'],
            relations: ['passwordToken'],
        });
        if (!userExists) {
            return (0, helpers_1.throwBadRequest)('User does not exist');
        }
        const passwordTokenEntry = userExists.passwordToken;
        if (!passwordTokenEntry?.token) {
            return (0, helpers_1.throwBadRequest)('Invalid token');
        }
        const isTokenMatch = await bcrypt.compareSync(token, passwordTokenEntry.token);
        if (!isTokenMatch) {
            return (0, helpers_1.throwBadRequest)('Incorrect token');
        }
        const now = new Date();
        const tokenCreation = new Date(passwordTokenEntry.updatedAt);
        const { TOKEN_EXPIRY } = process.env;
        const tokenExpiryMinutes = isNaN(parseInt(TOKEN_EXPIRY, 10))
            ? parseInt(TOKEN_EXPIRY, 10)
            : 15;
        tokenCreation.setMinutes(tokenCreation.getMinutes() + tokenExpiryMinutes);
        if (now > tokenCreation) {
            return (0, helpers_1.throwBadRequest)('Token has expired');
        }
        await this.manager.update(user_entity_1.User, {
            id: userExists.id,
        }, {
            password: bcrypt.hashSync(password),
        });
        await this.manager.delete(change_password_entity_1.ChangePassword, {
            id: passwordTokenEntry.id,
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=users.service.js.map