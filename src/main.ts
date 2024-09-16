import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseFormatterInterceptor } from './interceptors/response-formatter.interceptor';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger';
import { swaggerSetup } from './swagger-setup';


async function bootstrap() {
  const app = await NestFactory.create(AppModule ,{
    logger: WinstonModule.createLogger(winstonLoggerOptions), // Use Winston logger
  });

  app.setGlobalPrefix('api')
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());
  const corOption = { origin : ["*"], methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'], allowedHeaders: ["*"], credentials: true,};
  app.enableCors(corOption)
  swaggerSetup(app)

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);

}

bootstrap();
