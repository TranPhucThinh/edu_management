import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, TuitionType } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(teacherId: string, dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        name: dto.name,
        tuitionType: dto.tuitionType || TuitionType.MONTHLY_FIXED,
        defaultFee: dto.defaultFee || 0,
        teacherId,
      },
    });
  }

  async findAll(teacherId: string) {
    return this.prisma.course.findMany({
      where: {
        teacherId,
        isActive: true,
      },
      include: {
        classes: true,
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }
}
