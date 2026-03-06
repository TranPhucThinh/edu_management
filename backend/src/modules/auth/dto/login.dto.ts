import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ErrorCodes } from '../../../common/error-codes';

export class LoginDto {
  @IsEmail({}, { message: ErrorCodes.VALIDATION.INVALID_EMAIL })
  @IsNotEmpty({ message: ErrorCodes.VALIDATION.REQUIRED })
  email: string;

  @IsString()
  @MinLength(3, { message: ErrorCodes.VALIDATION.PASSWORD_TOO_SHORT })
  @IsNotEmpty({ message: ErrorCodes.VALIDATION.REQUIRED })
  password: string;
}
