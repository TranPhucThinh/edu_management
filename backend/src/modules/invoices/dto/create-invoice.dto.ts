import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  period: string; // VD: "2024-02" hoặc "Học kỳ 1"

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
