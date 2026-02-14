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
import { MOCK_TEACHER_ID } from 'src/constants';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(MOCK_TEACHER_ID, createStudentDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.studentsService.findAll(MOCK_TEACHER_ID, search);
  }
}
