import { PaymentMethod } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId: string;

  @IsNumber()
  @Min(1000)
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsOptional()
  note?: string;
}
