import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên học sinh không được để trống' })
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
