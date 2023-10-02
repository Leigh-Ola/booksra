"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const general_1 = require("./src/config/helpers/general");
const envs_1 = require("./src/config/envs");
const databaseConfig = (0, envs_1.default)().DB;
if (databaseConfig.url) {
    console.error('Connecting to db with url..');
    (0, lodash_1.unset)(databaseConfig, 'host');
    (0, lodash_1.unset)(databaseConfig, 'port');
    (0, lodash_1.unset)(databaseConfig, 'username');
    (0, lodash_1.unset)(databaseConfig, 'password');
    (0, lodash_1.unset)(databaseConfig, 'database');
}
else {
    console.error('Connecting to db with host and port..');
    (0, lodash_1.unset)(databaseConfig, 'url');
}
const defaultDataSourceOptions = {
    applicationName: 'BooksRoundAbout API',
    name: 'default',
    type: 'postgres',
    ...(0, lodash_1.omit)(databaseConfig, ['maxPoolConnCount']),
    synchronize: false,
    logging: ['error', 'warn', 'log', 'info'],
    logger: 'file',
    entities: ['./src/**/*.entity.{js,ts}'],
    migrations: [(0, general_1.pathFromSrc)('config/database/migrations/**/*.{js,ts}')],
    seeds: [(0, general_1.pathFromSrc)('config/database/seeds/**/*.{js,ts}')],
    factories: [(0, general_1.pathFromSrc)('config/database/factories/**/*.{js,ts}')],
    subscribers: [(0, general_1.pathFromSrc)('config/database/subscribers/**/*.{js,ts}')],
    migrationsRun: false,
    migrationsTableName: 'migrations',
    useUTC: true,
    connectTimeoutMS: 10000,
    dropSchema: false,
    migrationsTransactionMode: 'all',
    metadataTableName: 'typeorm_metadata',
    maxQueryExecutionTime: 15000,
    installExtensions: true,
    logNotifications: true,
    ssl: true,
    extra: {
        max: databaseConfig.maxPoolConnCount,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 10000,
        ssl: {
            rejectUnauthorized: false,
        },
    },
    cache: {
        type: 'database',
        tableName: 'typeorm_cache_table',
    },
};
exports.default = defaultDataSourceOptions;
//# sourceMappingURL=ormconfig.js.map