"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const class_validator_1 = require("class-validator");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const envs_1 = require("./config/envs");
const nestjs_pino_1 = require("nestjs-pino");
const mailer_1 = require("../src/utils/mailer");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: false,
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
        bufferLogs: true,
    });
    (0, mailer_1.sendMail)();
    const appConfig = (0, envs_1.default)();
    app.useGlobalInterceptors(new nestjs_pino_1.LoggerErrorInterceptor());
    let logger = undefined;
    if (appConfig.NODE_ENV === 'production') {
        logger = app.get(nestjs_pino_1.Logger);
        app.useLogger(logger);
    }
    app.flushLogs();
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.enableCors({
        allowedHeaders: '*',
        origin: '*',
        methods: '*',
        exposedHeaders: ['NEW_AUTH_TOKEN'],
    });
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    if (appConfig.NODE_ENV === 'development') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle(`${appConfig.PROJECT_NAME} API`)
            .setDescription(`${appConfig.PROJECT_NAME} API`)
            .setVersion('1.0')
            .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    await app.listen(process.env.PORT || process.env.SERVER_PORT || '3000', process.env.HOST || process.env.SERVER_HOST || '0.0.0.0');
    const msg = `Application is running on: ${await app.getUrl()}`;
    logger ? logger.log(msg) : console.log(msg);
}
bootstrap();
//# sourceMappingURL=main.js.map