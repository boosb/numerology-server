import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.getByEmail(email);
    
        if(!user) {
          throw new UnauthorizedException('User not found!');
        }
    
        // checked correct password
        const isPasswordMatching = await bcrypt.compare(
            password,
            user.password
        );
    
        if(!isPasswordMatching) {
          throw new UnauthorizedException('Password are incorrect!'); 
        }

        // checked is confirmed
        if(!user.isConfirmed) {
          throw new UnauthorizedException('Email is not confirmed!');
        }
        
        return user;
    }

    public getCookieWithJwtAccessToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });

        const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
        //todo Улучшением вышеизложенного было бы изменение  параметра Path  файла cookie токена обновления, чтобы браузер не отправлял его при каждом запросе.
        return {
          cookie,
          token
        };
    }

    public getCookieWithJwtRefreshToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
        });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
        return {
            cookie,
            token
        };
    }

    public async decodeConfirmationToken(token: string) {
        try {
          const payload = await this.jwtService.verify(token, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
          });
    
          if (typeof payload === 'object' && 'email' in payload && 'oldEmail' in payload) {
            return {
              email: payload.email,
              oldEmail: payload.oldEmail
            };
          }
          throw new BadRequestException();
        } catch (error) {
          if (error?.name === 'TokenExpiredError') {
            throw new BadRequestException('Email confirmation token expired');
          }
          throw new BadRequestException('Bad confirmation token');
        }
    }

    getCookiesForLogOut() {
      return [
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0'
      ];
    }
}