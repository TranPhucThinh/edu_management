import { Body, Controller, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';
import { MOCK_TEACHER_ID } from 'src/constants';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto, MOCK_TEACHER_ID);
  }
}
