import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ClassesModule } from './modules/classes/classes.module';
import { StudentsModule } from './modules/students/students.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CoursesModule,
    ClassesModule,
    StudentsModule,
    PrismaModule,
    SessionsModule,
    InvoicesModule,
    PaymentsModule,
    DashboardModule,
  ],
})
export class AppModule {}
