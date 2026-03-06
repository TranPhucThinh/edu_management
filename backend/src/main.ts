import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { BusinessExceptionFilter } from './common/filters/business-exception.filter';

function flattenErrors(
  errors: ValidationError[],
  parentField = '',
): { field: string; code: string }[] {
  const result: { field: string; code: string }[] = [];

  for (const error of errors) {
    const field = parentField
      ? `${parentField}.${error.property}`
      : error.property;

    if (error.constraints) {
      // Use the first constraint message (which is our error code)
      const code = Object.values(error.constraints)[0];
      result.push({ field, code });
    }

    if (error.children?.length) {
      result.push(...flattenErrors(error.children, field));
    }
  }

  return result;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new BusinessExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({
          errors: flattenErrors(errors),
        });
      },
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
