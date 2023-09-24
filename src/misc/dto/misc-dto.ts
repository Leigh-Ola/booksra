import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsEmail,
} from 'class-validator';

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
  @MaxLength(1000, {
    message: 'Please limit your message to 1000 characters.',
  })
  message: string;
}
