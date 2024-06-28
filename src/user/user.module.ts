import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import User from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import Forecast from '../forecast/entities/forecast.entity';
import UserForecast from '../forecast/entities/userForecast.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Forecast, UserForecast])
  ],
  controllers: [UserController],
  providers: [UserService, JwtService]
})
export class UserModule {}
