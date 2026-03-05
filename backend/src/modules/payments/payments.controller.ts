import { Body, Controller, Post } from '@nestjs/common';
import { GetTeacherId } from 'src/common/decorators/get-user.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  create(@Body() dto: CreatePaymentDto, @GetTeacherId() teacherId: string) {
    return this.paymentsService.create(dto, teacherId);
  }
}
