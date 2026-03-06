import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ErrorCodes } from '../../../common/error-codes';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: ErrorCodes.VALIDATION.REQUIRED })
  fullName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  parentName?: string;

  @IsString()
  @IsOptional()
  parentPhone?: string;
}
