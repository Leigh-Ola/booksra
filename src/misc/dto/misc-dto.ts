import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { MessageTypesEnum } from '../../utils/types';

export class ContactMessageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  company?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20, {
    message: 'Please enter at least 20 characters.',
  })
  @MaxLength(2000, {
    message: 'Please limit your message to 2000 characters.',
  })
  message: string;
}

export class UpdateMessageDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  message: string;

  @IsNotEmpty()
  @IsEnum(MessageTypesEnum)
  type: MessageTypesEnum;
}
