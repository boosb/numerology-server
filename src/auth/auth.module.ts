import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import User from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAccessTokenStrategy } from './strategies/jwt-access.strategy';
import Forecast from 'src/forecast/entities/forecast.entity';
import UserForecast from 'src/forecast/entities/userForecast.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Forecast, UserForecast])
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, JwtRefreshTokenStrategy, JwtAccessTokenStrategy, LocalStrategy]
})
export class AuthModule {}
