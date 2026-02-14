import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { MOCK_TEACHER_ID } from 'src/constants';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto, MOCK_TEACHER_ID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Post(':id/enroll')
  createEnrollment(
    @Param('id') classId: string,
    @Body() dto: EnrollStudentDto,
  ) {
    return this.classesService.enrollStudent(classId, dto);
  }
}
