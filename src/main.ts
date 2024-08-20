import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    //"origin": false 
    "origin": ["http://dailydestin.ru", "http://dailydestin.ru/", "http://dailydestin.ru:80/", "http://dailydestin.ru:5050/", "http://dailydestin.ru:5432/"],
    "credentials": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
