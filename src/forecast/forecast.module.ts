import { Module } from '@nestjs/common';
import { ForecastController } from './forecast.controller';
import { ForecastService } from './forecast.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/user/entities/user.entity';
import Forecast from './entities/forecast.entity';
import UserForecast from './entities/userForecast.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Forecast, UserForecast])
  ],
  controllers: [ForecastController],
  providers: [ForecastService, UserService, JwtService]
})
export class ForecastModule {}
