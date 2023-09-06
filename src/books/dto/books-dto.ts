import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  IsArray,
  MaxLength,
  IsEnum,
  IsUrl,
  MinLength,
} from 'class-validator';
import { BookCoversEnum } from '../../utils/types';

export class CreateBookDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  // code
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  code: string;

  // description
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description?: string;

  // cover
  @IsOptional()
  @IsEnum(BookCoversEnum)
  cover?: BookCoversEnum;

  // amountInStock
  @IsInt()
  @MinLength(1)
  @MaxLength(10)
  amountInStock?: number;

  // price
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10)
  price: number;

  // genre
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  // category
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  category?: string;

  // age range
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  ageRange?: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  imageUrl?: string;

  // code
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  code?: string;

  // description
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description?: string;

  // cover
  @IsOptional()
  @IsEnum(BookCoversEnum)
  cover?: BookCoversEnum;

  // amountInStock
  @IsOptional()
  @IsInt()
  @MinLength(1)
  @MaxLength(10)
  amountInStock?: number;

  // price
  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10)
  price?: number;

  // genre
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  // category
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  category?: string;

  // age range
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  ageRange?: string;
}
