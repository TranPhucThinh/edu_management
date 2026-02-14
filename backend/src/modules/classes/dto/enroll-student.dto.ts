import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class EnrollStudentDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  customFee?: number;
}
