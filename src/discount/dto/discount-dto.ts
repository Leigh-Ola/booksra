import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsInt,
  MaxLength,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { DiscountTypeEnum } from '../../utils/types';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  couponCode?: string;

  @IsNotEmpty()
  @IsEnum(DiscountTypeEnum)
  type: DiscountTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsArray()
  @IsInt({ each: true })
  bookIds: number[];
}

export class UpdateDiscountDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  couponCode?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(DiscountTypeEnum)
  type?: DiscountTypeEnum;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  bookIds?: number[];
}
