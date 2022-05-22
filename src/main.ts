import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  config();
  const port = process.env.PORT || 5001;
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
