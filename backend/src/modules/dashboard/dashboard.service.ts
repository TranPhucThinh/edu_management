import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(teacherId: string) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [totalStudents, activeClasses, monthlyRevenue, pendingInvoices] =
      await Promise.all([
        // A. Đếm tổng học sinh trong danh bạ
        this.prisma.student.count({
          where: { teacherId },
        }),

        // B. Đếm số lớp đang hoạt động
        this.prisma.class.count({
          where: {
            teacherId,
            isActive: true,
          },
        }),

        // C. Tính tổng tiền đã thu được trong tháng này (Doanh thu thực tế)
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            createdAt: {
              gte: firstDay,
              lte: lastDay,
            },
            invoice: { class: { teacherId } },
          },
        }),

        // D. Đếm số hóa đơn chưa đóng (Công nợ)
        this.prisma.invoice.count({
          where: {
            status: {
              in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL],
            },
            class: { teacherId },
          },
        }),
      ]);

    return {
      totalStudents,
      activeClasses,
      revenue: monthlyRevenue._sum.amount || 0,
      pendingInvoicesCount: pendingInvoices,
    };
  }
}
