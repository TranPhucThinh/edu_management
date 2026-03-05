import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetTeacherId } from 'src/common/decorators/get-user.decorator';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createCourseDto: CreateCourseDto, @GetTeacherId() teacherId: string) {
    return this.coursesService.create(teacherId, createCourseDto);
  }

  @Get()
  findAll(@GetTeacherId() teacherId: string) {
    return this.coursesService.findAll(teacherId);
  }
}
