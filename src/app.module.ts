import { Module, ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';
import { BookModule } from './books/books.module';
import { EntityController } from './entities/entities.controller';
import { EntityService } from './entities/entities.service';
import { EntitiesModule } from './entities/entities.module';
import { DiscountModule } from './discount/discount.module';
import { ValidationError } from 'class-validator';
import { first, has, isArray, isEmpty, values } from 'lodash';

const processClassValidatorErrors = (
  errors: ValidationError[],
  parent: Record<string, unknown> = {},
) => {
  const formattedErrors = errors.reduce((prev, error) => {
    if (!has(prev, error.property)) {
      prev[error.property] = first(values(error.constraints || {}));

      if (
        isEmpty(prev[error.property]) &&
        isArray(error.children) &&
        error.children.length > 0
      ) {
        prev[error.property] = processClassValidatorErrors(error.children);
      }
    }

    return prev;
  }, parent);

  return formattedErrors;
};

const validator = new ValidationPipe({
  whitelist: false,
  transform: true,
  exceptionFactory(errors) {
    const formattedErrors = processClassValidatorErrors(errors);

    return new BadRequestException(
      {
        status: false,
        code: 'DATA_VALIDATION_ERROR',
        errors: formattedErrors,
        message: 'Invalid data',
      },
      'Bad request',
    );
  },
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    BookModule,
    EntitiesModule,
    DiscountModule,
  ],
  controllers: [AppController, EntityController],
  providers: [
    AppService,
    EntityService,
    {
      provide: APP_PIPE,
      useValue: validator,
    },
  ],
})
export class AppModule {}
