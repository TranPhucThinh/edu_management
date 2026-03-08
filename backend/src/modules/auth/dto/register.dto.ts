import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ErrorCodes } from "src/common/error-codes";

export class RegisterDto {
  @IsEmail({}, { message: ErrorCodes.VALIDATION.INVALID_EMAIL })
  @IsNotEmpty({ message: ErrorCodes.VALIDATION.REQUIRED })
  email: string

  @IsString()
  @MinLength(3, { message: ErrorCodes.VALIDATION.PASSWORD_TOO_SHORT })
  @IsNotEmpty({ message: ErrorCodes.VALIDATION.REQUIRED })
  password: string;

  @IsString()
  @MinLength(2, { message: ErrorCodes.VALIDATION.FULLNAME_TOO_SHORT })
  @IsNotEmpty({ message: ErrorCodes.VALIDATION.REQUIRED })
  fullName: string
}
