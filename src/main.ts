import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    //"origin": false 
    "origin": [
      "http://dailydestin.ru", "http://dailydestin.ru/", "http://dailydestin.ru:80/", "http://dailydestin.ru:5050/", "http://dailydestin.ru:5432/",
      "http://46.19.67.196", "http://46.19.67.196:80", "http://46.19.67.196:8080", "http://46.19.67.196:5050", "http://46.19.67.196:5432"
    ],
    "credentials": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
