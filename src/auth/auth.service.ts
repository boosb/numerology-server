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
    
        const isPasswordMatching = await bcrypt.compare(
            user.password,
            password
        );
       // const passwordIsMatch = await bcrypt.verify(user.password, password);
    
        if(!isPasswordMatching) {
          throw new UnauthorizedException('Password are incorrect!'); 
        }
        
        return user;
      }

    public getCookieWithJwtAccessToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });
        //todo Улучшением вышеизложенного было бы изменение  параметра Path  файла cookie токена обновления, чтобы браузер не отправлял его при каждом запросе.
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
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
}