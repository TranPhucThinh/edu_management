import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorCodes } from 'src/common/error-codes';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClassDto, teacherId: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        id: dto.courseId,
        teacherId,
      },
    });

    if (!course) {
      throw new ForbiddenException(
        ErrorCodes.CLASS.COURSE_NOT_FOUND_OR_FORBIDDEN,
      );
    }

    const existingClass = await this.prisma.class.findFirst({
      where: {
        teacherId,
        courseId: dto.courseId,
        name: dto.name,
        isActive: true,
      },
    });

    if (existingClass) {
      throw new ConflictException(ErrorCodes.CLASS.DUPLICATE_NAME);
    }

    return this.prisma.class.create({
      data: {
        name: dto.name,
        courseId: dto.courseId,
        schedule: dto.schedule ?? [],
        tuitionType: dto.tuitionType ?? null,
        defaultFee: dto.defaultFee ?? null,
        isActive: true,
        teacherId: teacherId,
      },
    });
  }

  // Update whole class data (does NOT modify existing invoices)
  async updateClass(classId: string, dto: UpdateClassDto, teacherId: string) {
    if (
      dto.name === undefined &&
      dto.schedule === undefined &&
      dto.tuitionType === undefined &&
      dto.defaultFee === undefined
    ) {
      throw new BadRequestException(ErrorCodes.VALIDATION.INVALID_INPUT);
    }

    return this.prisma.$transaction(async (tx) => {
      const classInfo = await tx.class.findFirst({
        where: { id: classId, teacherId },
        select: { id: true, name: true, courseId: true },
      });

      if (!classInfo) {
        throw new NotFoundException(ErrorCodes.CLASS.NOT_FOUND);
      }

      if (dto.name !== undefined && dto.name !== classInfo.name) {
        const existingClass = await tx.class.findFirst({
          where: {
            teacherId,
            courseId: classInfo.courseId,
            name: dto.name,
            isActive: true,
            id: { not: classId },
          },
        });

        if (existingClass) {
          throw new ConflictException(ErrorCodes.CLASS.DUPLICATE_NAME);
        }
      }

      const data: {
        name?: string;
        schedule?: string[];
        tuitionType?: UpdateClassDto['tuitionType'];
        defaultFee?: UpdateClassDto['defaultFee'];
      } = {};

      if (dto.name !== undefined) data.name = dto.name;
      if (dto.schedule !== undefined) data.schedule = dto.schedule;
      if (dto.tuitionType !== undefined) data.tuitionType = dto.tuitionType;
      if (dto.defaultFee !== undefined) data.defaultFee = dto.defaultFee;

      return tx.class.update({
        where: { id: classId },
        data,
      });
    });
  }

  async findOne(id: string) {
    return this.prisma.class.findUnique({
      where: { id },
      include: {
        course: true,
        enrollments: {
          include: { student: true },
        },
      },
    });
  }

  async enrollStudent(classId: string, dto: EnrollStudentDto) {
    return this.prisma.$transaction(async (tx) => {
      const classInfo = await tx.class.findUnique({
        where: { id: classId },
        include: {
          course: true,
        },
      });

      if (!classInfo) {
        throw new NotFoundException(ErrorCodes.CLASS.NOT_FOUND);
      }

      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          studentId_classId: {
            studentId: dto.studentId,
            classId: classId,
          },
        },
      });

      if (existingEnrollment) {
        throw new ConflictException(ErrorCodes.CLASS.STUDENT_ALREADY_ENROLLED);
      }

      return tx.enrollment.create({
        data: {
          classId,
          studentId: dto.studentId,
          customFee: dto.customFee,
        },
      });
    });
  }
}
