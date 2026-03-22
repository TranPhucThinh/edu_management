import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { GetTeacherId } from 'src/common/decorators/get-user.decorator';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createClassDto: CreateClassDto, @GetTeacherId() teacherId: string) {
    return this.classesService.create(createClassDto, teacherId);
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

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateClass(
    @Param('id') classId: string,
    @Body() dto: UpdateClassDto,
    @GetTeacherId() teacherId: string,
  ) {
    return this.classesService.updateClass(classId, dto, teacherId);
  }
}
