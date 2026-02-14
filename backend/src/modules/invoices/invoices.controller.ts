import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { MOCK_TEACHER_ID } from 'src/constants';

// Nhớ thay UUID thật của User mà bạn đã tạo vào đây

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto, MOCK_TEACHER_ID);
  }

  @Get()
  findAll(@Query('classId') classId: string) {
    return this.invoicesService.findAll(classId);
  }
}
