import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { TuitionType } from '../../courses/dto/create-course.dto';
import { ErrorCodes } from '../../../common/error-codes';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: ErrorCodes.VALIDATION.REQUIRED })
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  schedule?: string[];

  // Optional override for fee coming from Course (set to null to fallback to Course)
  @ValidateIf((o) => o.tuitionType !== null && o.tuitionType !== undefined)
  @IsEnum(TuitionType)
  tuitionType?: TuitionType | null;

  // Optional override for fee coming from Course (set to null to fallback to Course)
  @ValidateIf((o) => o.defaultFee !== null && o.defaultFee !== undefined)
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value === null ? null : Number(value)))
  defaultFee?: number | null;
}

