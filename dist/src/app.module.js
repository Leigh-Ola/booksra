"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const books_module_1 = require("./books/books.module");
const entities_controller_1 = require("./entities/entities.controller");
const entities_service_1 = require("./entities/entities.service");
const entities_module_1 = require("./entities/entities.module");
const discount_module_1 = require("./discount/discount.module");
const lodash_1 = require("lodash");
const location_service_1 = require("./location/location.service");
const location_controller_1 = require("./location/location.controller");
const location_module_1 = require("./location/location.module");
const processClassValidatorErrors = (errors, parent = {}) => {
    const formattedErrors = errors.reduce((prev, error) => {
        if (!(0, lodash_1.has)(prev, error.property)) {
            prev[error.property] = (0, lodash_1.first)((0, lodash_1.values)(error.constraints || {}));
            if ((0, lodash_1.isEmpty)(prev[error.property]) &&
                (0, lodash_1.isArray)(error.children) &&
                error.children.length > 0) {
                prev[error.property] = processClassValidatorErrors(error.children);
            }
        }
        return prev;
    }, parent);
    return formattedErrors;
};
const validator = new common_1.ValidationPipe({
    whitelist: false,
    transform: true,
    exceptionFactory(errors) {
        const formattedErrors = processClassValidatorErrors(errors);
        return new common_1.BadRequestException({
            status: false,
            code: 'DATA_VALIDATION_ERROR',
            errors: formattedErrors,
            message: 'Invalid data',
        }, 'Bad request');
    },
});
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                type: process.env.DB_TYPE,
                ...(process.env.DATABASE_URL && {
                    url: process.env.DATABASE_URL,
                }),
                ...(!process.env.DATABASE_URL && {
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT),
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                }),
            }),
            users_module_1.UserModule,
            books_module_1.BookModule,
            entities_module_1.EntitiesModule,
            discount_module_1.DiscountModule,
            location_module_1.LocationModule,
        ],
        controllers: [app_controller_1.AppController, entities_controller_1.EntityController, location_controller_1.LocationController],
        providers: [
            app_service_1.AppService,
            entities_service_1.EntityService,
            {
                provide: core_1.APP_PIPE,
                useValue: validator,
            },
            location_service_1.LocationService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map