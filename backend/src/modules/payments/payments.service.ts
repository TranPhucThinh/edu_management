import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorCodes } from 'src/common/error-codes';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto, creatorId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: dto.invoiceId },
      include: { payments: true },
    });

    if (!invoice)
      throw new NotFoundException(ErrorCodes.PAYMENT.INVOICE_NOT_FOUND);
    if (invoice.status === PaymentStatus.PAID)
      throw new BadRequestException(ErrorCodes.PAYMENT.INVOICE_ALREADY_PAID);

    const currentPaid = invoice.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
    const totalRequired = Number(invoice.amount);
    const newPaidTotal = currentPaid + dto.amount;

    let newStatus: PaymentStatus = invoice.status;
    if (newPaidTotal >= totalRequired) newStatus = PaymentStatus.PAID;
    else newStatus = PaymentStatus.PARTIAL;

    // 4. Thực hiện Transaction (Tạo Payment + Update Invoice + Log)
    return this.prisma.$transaction(async (tx) => {
      // 4.1 Tạo record Payment
      const payment = await tx.payment.create({
        data: {
          invoiceId: dto.invoiceId,
          amount: dto.amount,
          method: dto.method,
          note: dto.note,
        },
      });

      // 4.2 Update trạng thái Invoice nếu thay đổi
      if (newStatus !== invoice.status) {
        await tx.invoice.update({
          where: { id: dto.invoiceId },
          data: {
            status: newStatus,
            paidAt: newStatus === PaymentStatus.PAID ? new Date() : null,
          },
        });

        // 4.3 Ghi Log thay đổi trạng thái
        await tx.invoiceLog.create({
          data: {
            invoiceId: dto.invoiceId,
            oldStatus: invoice.status,
            newStatus,
            changedById: creatorId,
          },
        });
      }

      return payment;
    });
  }
}
