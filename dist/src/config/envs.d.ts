declare const _default: (() => {
    NODE_ENV: string;
    PROJECT_NAME: string;
    SERVER_URL: string;
    SERVER_HOST: string;
    SERVER_PORT: number;
    APP_KEY: string;
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    TOKEN_EXPIRY: number;
    SITE_ADMIN_EMAIL: string;
    EMAIL_MIN_INTERVAL: number;
    ELASTIC_EMAIL_HTTP_PASSWORD: string;
    DB_TYPE: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB: {
        url: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        maxPoolConnCount: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    NODE_ENV: string;
    PROJECT_NAME: string;
    SERVER_URL: string;
    SERVER_HOST: string;
    SERVER_PORT: number;
    APP_KEY: string;
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    TOKEN_EXPIRY: number;
    SITE_ADMIN_EMAIL: string;
    EMAIL_MIN_INTERVAL: number;
    ELASTIC_EMAIL_HTTP_PASSWORD: string;
    DB_TYPE: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB: {
        url: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        maxPoolConnCount: number;
    };
}>;
export default _default;
