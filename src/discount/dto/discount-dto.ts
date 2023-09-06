import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsInt,
  MaxLength,
  IsEnum,
  IsDate,
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
