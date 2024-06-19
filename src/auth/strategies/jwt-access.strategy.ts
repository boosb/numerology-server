import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import User from 'src/user/entities/user.entity';
import { Request } from 'express';


@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-access-token'
) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(user: User) { // todo чет это не юзер, а ИД юзера
    console.log(user, ' >> user')
    //todo разобраться бы с этими объектами
    return { id: user.id || user['userId'], email: user.email };
  }
}