import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { GetTeacherId } from 'src/common/decorators/get-user.decorator';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createStudentDto: CreateStudentDto, @GetTeacherId() teacherId: string) {
    return this.studentsService.create(teacherId, createStudentDto);
  }

  @Get()
  findAll(@GetTeacherId() teacherId: string, @Query('search') search?: string) {
    return this.studentsService.findAll(teacherId, search);
  }
}
