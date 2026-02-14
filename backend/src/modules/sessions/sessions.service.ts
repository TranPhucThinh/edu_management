import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSessionDto) {
    return this.prisma.classSession.create({
      data: {
        classId: dto.classId,
        date: new Date(dto.date),
        note: dto.note,

        attendances: {
          create: dto.attendances.map((item) => ({
            studentId: item.studentId,
            isPresent: item.isPresent ?? true,
            note: item.note,
            sessionFeeSnapshot: 0,
          })),
        },
      },
      include: {
        attendances: true,
      },
    });
  }

  // Lấy lịch sử các buổi học của 1 lớp
  async findByClass(classId: string) {
    return this.prisma.classSession.findMany({
      where: { classId },
      include: {
        _count: {
          select: { attendances: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.classSession.findUnique({
      where: { id },
      include: {
        attendances: {
          include: { student: true },
        },
      },
    });
  }
}
