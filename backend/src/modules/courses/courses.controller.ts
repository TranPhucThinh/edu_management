import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { MOCK_TEACHER_ID } from 'src/constants';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(MOCK_TEACHER_ID, createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll(MOCK_TEACHER_ID);
  }
}
