import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from "@nestjs/common";
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
                return request?.cookies?.Refresh;
            }]),
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        const refreshToken = request.cookies?.Refresh;
        return this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
    }
}