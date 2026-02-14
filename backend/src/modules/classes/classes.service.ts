import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClassDto, teacherId: string) {
    return this.prisma.class.create({
      data: {
        name: dto.name,
        courseId: dto.courseId,
        schedule: dto.schedule ?? [],
        isActive: true,
        teacherId: teacherId,
      },
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
        throw new Error('Lớp học không tồn tại');
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
        throw new ConflictException('Học sinh đã được ghi danh vào lớp này');
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
