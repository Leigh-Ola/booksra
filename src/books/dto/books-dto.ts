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
  IsAlphanumeric,
  Max,
  Min,
  MinLength,
  Matches,
  IsNumberString,
} from 'class-validator';
import { BookCoversEnum, SortByPriceEnum } from '../../utils/types';

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
  @MaxLength(2555)
  description?: string;

  // cover
  @IsOptional()
  @IsEnum(BookCoversEnum)
  cover?: BookCoversEnum;

  // amountInStock
  @IsInt()
  @Min(0)
  @Max(99999)
  amountInStock?: number;

  // price
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  @Min(0)
  @Max(9999999)
  price: number;

  // genre
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  // category
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(255)
  category?: string;

  // age range
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+-[0-9]+$|^[0-9]+\+$/, {
    message: 'Age range must be in the format of 0-0 or 0+',
  })
  @MaxLength(7)
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
  @MaxLength(2555)
  description?: string;

  // cover
  @IsOptional()
  @IsEnum(BookCoversEnum)
  cover?: BookCoversEnum;

  // amountInStock
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  amountInStock?: number;

  // price
  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  @Min(0)
  @Max(9999999)
  price: number;

  // genre
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  // category
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(255)
  category?: string;

  // age range
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+-[0-9]+$|^[0-9]+\+$/, {
    message: 'Age range must be in the format of 0-0 or 0+',
  })
  @MaxLength(7)
  ageRange?: string;
}

export class GetBooksDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  query?: string;

  // genre
  @IsOptional()
  @IsString()
  @MaxLength(255)
  genre?: string;

  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(255)
  category?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+-[0-9]+$|^[0-9]+\+$/, {
    message: 'Age range must be in the format of 0-0 or 0+',
  })
  @MaxLength(7)
  ageRange?: string;

  @IsOptional()
  @IsEnum(BookCoversEnum)
  cover?: BookCoversEnum;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsEnum(SortByPriceEnum)
  sortByPrice?: SortByPriceEnum;
}
