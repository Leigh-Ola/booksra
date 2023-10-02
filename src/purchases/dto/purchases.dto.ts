import {
  IsNotEmpty,
  IsString,
  IsNumberString,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryTypeEnum } from '../../utils/types';

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
