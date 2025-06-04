import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
   const logger = new Logger();
   const app = await NestFactory.create<NestExpressApplication>(AppModule);
   app.enableCors(); // Kích hoạt CORS
   // app.use('./uploads', express.static('uploads'));
   app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
   app.use('/slidebanners', express.static(join(__dirname, '..', 'slidebanners')));
   app.useGlobalPipes(new ValidationPipe({ transform: true }));
   app.useGlobalInterceptors(new TransformInterceptor());
   app.set('trust proxy', true);
   const port = 3002;
   await app.listen(port);
   logger.log(`Application listening on port ${port}`);
}
bootstrap();
