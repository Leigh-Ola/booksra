// import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumberString,
  MaxLength,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    },
    {
      message: 'Your password needs to be at least six digits long',
    },
  )
  password: string;

  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  phone: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  address: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  companyName?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  country: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  town: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  state: string;

  @IsOptional()
  @IsNumberString()
  @MaxLength(25)
  zipCode: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  companyName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  country?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  town?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  state?: string;

  @IsNumberString()
  @IsOptional()
  @MaxLength(25)
  zipCode?: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  email: string;

  @IsString()
  @MaxLength(30)
  password: string;
}

export class UserChangePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  email: string;
}

export class UserResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    },
    {
      message: 'Your password needs to be at least six digits long',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  confirmPassword: string;
}
