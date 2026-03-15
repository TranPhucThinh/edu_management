import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorCodes } from 'src/common/error-codes';
import { CreateCourseDto, TuitionType } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(teacherId: string, dto: CreateCourseDto) {
    const existing = await this.prisma.course.findFirst({
      where: {
        teacherId,
        name: dto.name,
        isActive: true,
      },
    });

    if (existing) {
      throw new ConflictException(ErrorCodes.COURSE.DUPLICATE_NAME);
    }

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
