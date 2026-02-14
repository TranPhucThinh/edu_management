import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum TuitionType {
  PER_SESSION = 'PER_SESSION',
  MONTHLY_FIXED = 'MONTHLY_FIXED',
}

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên khóa học không được để trống' })
  name: string;

  @IsEnum(TuitionType)
  @IsOptional()
  tuitionType?: TuitionType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  defaultFee?: number;
}
