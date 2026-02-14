import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên lớp không được để trống' })
  name: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Phải chọn khóa học' })
  courseId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  schedule?: string[];
}
