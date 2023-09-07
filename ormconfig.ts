import { omit, unset } from 'lodash';
import { pathFromSrc } from './src/config/helpers/general';
import { DataSourceOptions } from 'typeorm';
// import processDatabaseConfig from './src/config/envs/database.config';
import getAppConfig from './src/config/envs';

type TypeOrmDataSourceOptions = DataSourceOptions & {
  seeds: string[];
  factories: string[];
};

// const databaseConfig = processDatabaseConfig();
const databaseConfig = getAppConfig().DB;
if (databaseConfig.url) {
  console.error('Connecting to db with url..');
  unset(databaseConfig, 'host');
  unset(databaseConfig, 'port');
  unset(databaseConfig, 'username');
  unset(databaseConfig, 'password');
  unset(databaseConfig, 'database');
} else {
  console.error('Connecting to db with host and port..');
  unset(databaseConfig, 'url');
}

const defaultDataSourceOptions: TypeOrmDataSourceOptions = {
  applicationName: 'BooksRoundAbout API',
  name: 'default',
  type: 'postgres',
  ...omit(databaseConfig, ['maxPoolConnCount']),
  synchronize: false,
  logging: ['error', 'warn', 'log', 'info'],
  logger: 'file',
  entities: ['./src/**/*.entity.{js,ts}'],
  migrations: [pathFromSrc('config/database/migrations/**/*.{js,ts}')],
  seeds: [pathFromSrc('config/database/seeds/**/*.{js,ts}')],
  factories: [pathFromSrc('config/database/factories/**/*.{js,ts}')],
  subscribers: [pathFromSrc('config/database/subscribers/**/*.{js,ts}')],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  useUTC: true,
  connectTimeoutMS: 10000,
  dropSchema: false,
  migrationsTransactionMode: 'all',
  metadataTableName: 'typeorm_metadata',
  maxQueryExecutionTime: 15000, //Ideal should be 10000 (10s)
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

export default defaultDataSourceOptions;
