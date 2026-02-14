import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class AttendanceItemDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsBoolean()
  @IsOptional()
  isPresent?: boolean;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateSessionDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true }) // Quan trọng: Validate từng item bên trong mảng
  @Type(() => AttendanceItemDto) // Quan trọng: Ánh xạ sang class con để validate
  attendances: AttendanceItemDto[];
}
