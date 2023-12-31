// get and expose all configs in .env
import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const processEnvObj = process.env;
const getAppConfig = () => {
  let nodeEnv = String(processEnvObj.NODE_ENV).toLowerCase();
  if (!['development', 'staging', 'production', 'test'].includes(nodeEnv)) {
    nodeEnv = 'development';
  }

  return {
    NODE_ENV: nodeEnv,
    PROJECT_NAME: processEnvObj.PROJECT_NAME,

    SERVER_URL: String(processEnvObj.SERVER_URL).toLowerCase(),
    SERVER_HOST: processEnvObj.SERVER_HOST,
    SERVER_PORT: parseInt(processEnvObj.SERVER_PORT || '8080') || 8080,
    APP_KEY: processEnvObj.APP_KEY,
    JWT_SECRET: processEnvObj.JWT_SECRET,
    JWT_EXPIRY: processEnvObj.JWT_EXPIRY || '8h',
    TOKEN_EXPIRY: parseInt(String(processEnvObj.TOKEN_EXPIRY), 10) || 5,
    SITE_ADMIN_EMAIL: processEnvObj.SITE_ADMIN_EMAIL,
    EMAIL_MIN_INTERVAL:
      parseInt(String(processEnvObj.EMAIL_MIN_INTERVAL), 5) || 5,

    ELASTIC_EMAIL_HTTP_PASSWORD: processEnvObj.ELASTIC_EMAIL_HTTP_PASSWORD,
    EMAIL_SENDER_USERNAME: processEnvObj.EMAIL_SENDER_USERNAME,
    EMAIL_SENDER_PASSWORD: processEnvObj.EMAIL_SENDER_PASSWORD,

    BACKGROUND_JOB_CODE: processEnvObj.BACKGROUND_JOB_CODE,
    ALLOW_BACKGROUND_JOBS: processEnvObj.ALLOW_BACKGROUND_JOBS,

    PAYMENT_SECRET_KEY: processEnvObj.PAYMENT_SECRET_KEY,
    SUBACCOUNT_CODE: processEnvObj.SUBACCOUNT_CODE,
    SELF_PAYMENT_PERCENTAGE:
      parseInt(processEnvObj.SELF_PAYMENT_PERCENTAGE, 10) || 10,
    SELF_PAYMENT_MONTHLY_MAX_AMOUNT:
      parseInt(processEnvObj.SELF_PAYMENT_MONTHLY_MAX_AMOUNT, 10) || 400000,

    AWS_KEY: processEnvObj.AWS_KEY,
    AWS_SECRET: processEnvObj.AWS_SECRET,
    AWS_BUCKET_NAME: processEnvObj.AWS_BUCKET_NAME,

    DB_TYPE: processEnvObj.DB_TYPE,
    DB_HOST: processEnvObj.DB_HOST,
    DB_PORT: parseInt(processEnvObj.DB_PORT),
    DB_USER: processEnvObj.DB_USER,
    DB_PASSWORD: processEnvObj.DB_PASSWORD,
    DB_NAME: processEnvObj.DB_NAME,
    DB: {
      url: processEnvObj.DATABASE_URL,
      host: processEnvObj.DB_HOST,
      port: parseInt(String(processEnvObj.DB_PORT || '5432'), 10) || 5432,
      username: processEnvObj.DB_USER,
      password: processEnvObj.DB_PASSWORD,
      database: processEnvObj.DB_NAME,
      maxPoolConnCount:
        parseInt(String(processEnvObj.DB_CONN_POOL_COUNT), 10) || 10,
    },
  };
};

export default registerAs('app', getAppConfig);
