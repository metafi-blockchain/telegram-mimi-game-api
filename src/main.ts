import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseFormatterInterceptor } from './interceptors/response-formatter.interceptor';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger';
import { swaggerSetup } from './swagger-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  // Global Pipes for Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response Interceptor
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());

  // CORS configuration (adjust for production)
  const corOption = { 
    origin: process.env.NODE_ENV === 'production' 
      ? ["*"]
      : ["*"], 
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ["*"]
  };

  app.enableCors(corOption);

  // Swagger API Docs Setup
  swaggerSetup(app);

  // Listen to a specified port
  await app.listen(process.env.PORT || 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();