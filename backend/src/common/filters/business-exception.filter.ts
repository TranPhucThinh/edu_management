import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // NestJS can return either a string or an object from getResponse()
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as Record<string, unknown>).message;

    // If the message matches an error code pattern (e.g. "AUTH.INVALID_CREDENTIALS"),
    // include it as errorCode. Otherwise just pass through the original message.
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
