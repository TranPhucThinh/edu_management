import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetTeacherId } from 'src/common/decorators/get-user.decorator';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto, @GetTeacherId() teacherId: string) {
    return this.invoicesService.create(createInvoiceDto, teacherId);
  }

  @Get()
  findAll(@Query('classId') classId: string) {
    return this.invoicesService.findAll(classId);
  }
}
