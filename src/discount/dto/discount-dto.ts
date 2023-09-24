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
import {
  DiscountTypeEnum,
  DiscountCategoryEnum,
  CouponTypeEnum,
} from '../../utils/types';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  // required
  @IsNotEmpty()
  @IsEnum(DiscountTypeEnum)
  type: DiscountTypeEnum;

  // required
  @IsNotEmpty()
  @IsEnum(DiscountCategoryEnum)
  category: DiscountCategoryEnum;

  // if GENERAL category
  // optional
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  bookIds?: number[];

  // if COUPON category
  // optional
  @IsOptional()
  @IsString()
  @MaxLength(30)
  couponCode?: string;

  // optional
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(CouponTypeEnum)
  couponType?: CouponTypeEnum;

  // optional
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  couponMinValue?: number;
}

export class UpdateDiscountDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name?: string;

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

  // required
  @IsNotEmpty()
  @IsEnum(DiscountTypeEnum)
  type?: DiscountTypeEnum;

  // NOTE: You cannot update the category of a discount

  // if GENERAL category
  // optional
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  bookIds?: number[];

  // if COUPON category
  // optional
  @IsOptional()
  @IsString()
  @MaxLength(30)
  couponCode?: string;

  // optional
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(CouponTypeEnum)
  couponType?: CouponTypeEnum;

  // optional
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  couponMinValue?: number;
}
