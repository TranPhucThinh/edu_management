import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(teacherId: string, dto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        ...dto,
        teacherId,
      },
    });
  }

  async findAll(teacherId: string, search?: string) {
    return this.prisma.student.findMany({
      where: {
        teacherId,
        OR: search
          ? [
              {
                fullName: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                parentPhone: {
                  contains: search,
                },
              },
            ]
          : undefined,
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }
}
