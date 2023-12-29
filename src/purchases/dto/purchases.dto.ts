import {
  IsNotEmpty,
  IsString,
  IsNumberString,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  IsUrl,
  IsBooleanString,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryTypeEnum, PaymentStatusEnum } from '../../utils/types';

class BookDto {
  @IsNotEmpty()
  @IsNumberString()
  bookId: string;

  @IsNotEmpty()
  @IsNumberString()
  quantity: string;
}

export class CalculatePurchaseDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BookDto)
  books: BookDto[];

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(DeliveryTypeEnum)
  deliveryType?: DeliveryTypeEnum;

  @IsOptional()
  @IsNumberString()
  locationId?: string;
}

export class NewPurchaseDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BookDto)
  books: BookDto[];

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsEnum(DeliveryTypeEnum)
  @IsNotEmpty()
  deliveryType: DeliveryTypeEnum;

  @IsOptional()
  @IsNumberString()
  locationId?: string;

  @IsUrl()
  @IsNotEmpty()
  callbackUrl: string;
}

export class GetPurchasesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  paymentReference?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumberString()
  userId?: string;

  @IsOptional()
  @IsNumberString()
  locationId?: string;

  @IsOptional()
  @IsBooleanString()
  isDelivery?: boolean;

  @IsOptional()
  @IsBooleanString()
  isDiscountApplied?: boolean;

  @IsOptional()
  @IsEnum(PaymentStatusEnum)
  paymentStatus?: PaymentStatusEnum;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
