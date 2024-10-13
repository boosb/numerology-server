import { ExtractJwt, Strategy } from 'passport-jwt';
import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';


@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token'
) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                console.log(request?.cookies, ' >>> request')
                if (!request?.cookies?.Refresh) {
                    console.log('HELLO')
                    throw new BadRequestException('User is not auth');
                }
                return request?.cookies?.Refresh
            }]),
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        const refreshToken = request.cookies?.Refresh;
        console.log(refreshToken, ' >>> refreshToken-------1')
        return await this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
    }
}