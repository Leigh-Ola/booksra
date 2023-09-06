// location dto
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  price: number;
}

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  deliveryPrice?: number;
}
