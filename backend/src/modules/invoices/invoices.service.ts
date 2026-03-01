import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorCodes } from 'src/common/error-codes';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInvoiceDto, creatorId: string) {
    // 1. Kiểm tra xem đã có hóa đơn cho tháng này chưa? (Tránh thu trùng)
    const existingInvoice = await this.prisma.invoice.findFirst({
      where: {
        studentId: dto.studentId,
        classId: dto.classId,
        period: dto.period,
      },
    });

    if (existingInvoice) {
      throw new ConflictException(ErrorCodes.INVOICE.DUPLICATE_PERIOD);
    }

    // 2. Lấy thông tin Enrollment để biết giá tiền
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: dto.studentId,
          classId: dto.classId,
        },
      },
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException(ErrorCodes.INVOICE.STUDENT_NOT_ENROLLED);
    }

    // 3. Logic tính tiền (Pricing Strategy)
    let finalAmout = enrollment.class.course.defaultFee; // Mặc định lấy giá Course

    if (enrollment.class.defaultFee !== null) {
      finalAmout = enrollment.class.defaultFee; // Lấy giá Class override
    }
    if (enrollment.customFee !== null) {
      finalAmout = enrollment.customFee; // Lấy giá riêng của HS
    }

    // 4. Tạo Invoice + Ghi Log (Transaction)
    // Dùng transaction để đảm bảo tạo Invoice xong là phải ghi Log ngay
    return this.prisma.$transaction(async (tx) => {
      // 4.1 Tạo Invoice
      const newInvoice = await tx.invoice.create({
        data: {
          code: `INV-${Date.now()}`,
          studentId: dto.studentId,
          classId: dto.classId,
          period: dto.period,
          amount: finalAmout,
          status: PaymentStatus.PENDING,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        },
      });

      // 4.2 Ghi Log (Audit Trail) - Ai là người tạo đơn này?
      await tx.invoiceLog.create({
        data: {
          invoiceId: newInvoice.id,
          oldStatus: null,
          newStatus: PaymentStatus.PENDING,
          changedById: creatorId,
        },
      });

      return newInvoice;
    });
  }

  async findAll(classId: string) {
    return await this.prisma.invoice.findMany({
      where: {
        classId,
      },
      include: {
        student: true,
        logs: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
