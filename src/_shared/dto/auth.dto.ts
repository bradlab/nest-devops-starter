import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import {
  IForgotPasswordDTO,
  IResetPasswordDTO,
  ISigninAccoutDTO,
  IUpdatePwdDTO,
} from '../interface/auth.input.dto';

export class UpdatePwdDTO implements IUpdatePwdDTO {
  @ApiProperty({
    type: String,
    name: 'oldPassword',
    description: 'The old password of the user',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({ type: String, name: 'newPassword' })
  @IsString()
  newPassword: string;
}
export class SigninAccoutDTO implements ISigninAccoutDTO {
  @ApiProperty({
    type: String,
    name: 'email',
    description: 'The email address if the plateform use it for login',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    name: 'phone',
    description: 'The phone number if the plateform use it for login',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ type: String, name: 'password' })
  @IsString()
  password: string;
}

export class ForgotPasswordDTO implements IForgotPasswordDTO {
  @ApiProperty({
    type: String,
    name: 'email',
    description: 'The email address if the plateform use it for login',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    name: 'phone',
    description: 'The phone number if the plateform use it for login',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}

export class ResetPasswordDTO
  extends SigninAccoutDTO
  implements IResetPasswordDTO
{
  @ApiProperty({
    type: String,
    name: 'otpCode',
    description: 'The otp validation code for reseting',
  })
  @IsOptional() // TODO: this is required
  @IsNotEmpty()
  otpCode: string;
}
