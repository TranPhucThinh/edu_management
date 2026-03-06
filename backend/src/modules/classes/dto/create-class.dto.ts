import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ErrorCodes } from '../../../common/error-codes';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty({ message: ErrorCodes.VALIDATION.REQUIRED })
  name: string;

  @IsUUID()
  @IsNotEmpty({ message: ErrorCodes.VALIDATION.REQUIRED })
  courseId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  schedule?: string[];
}
