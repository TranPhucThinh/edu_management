import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCodes } from '../error-codes';

type FieldError = { field: string; code: string };

/** Response từ exceptionFactory (structured): { errors: FieldError[] } */
function isFieldErrorResponse(res: unknown): res is { errors: FieldError[] } {
  return (
    typeof res === 'object' &&
    res !== null &&
    Array.isArray((res as Record<string, unknown>).errors)
  );
}

@Catch(HttpException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 1. Lỗi validation DTO (exceptionFactory): { errors: { field, code }[] }
    if (isFieldErrorResponse(exceptionResponse)) {
      response.status(status).json({
        statusCode: status,
        errorCode: ErrorCodes.VALIDATION.INVALID_INPUT,
        errors: exceptionResponse.errors,
      });
      return;
    }

    // 2. Lỗi throw từ service/controller: string hoặc object có message
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as Record<string, unknown>).message;

    const errorCode =
      typeof message === 'string' && /^[A-Z]+__[A-Z_]+$/.test(message)
        ? message
        : undefined;

    response.status(status).json({
      statusCode: status,
      ...(errorCode ? { errorCode } : {}),
      message,
    });
  }
}
