import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Param, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './quards/local-auth.guard';
import JwtRefreshGuard from './quards/jwt-refresh.quard';
import { Request } from 'express';
import JwtAccessGuard from './quards/jwt-access.guard';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';

@Controller('auth')
//@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UserService
    ) {}

    //@HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUser) {
      const { user } = request;
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user['id']);
      const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user['id']);
   
      await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user['id']);
   
      request.res.setHeader('Set-Cookie', [accessTokenCookie.cookie, refreshTokenCookie.cookie]);
      request.res.cookie('Refresh', refreshTokenCookie.token)
      //request.res.cookie('Authentication', accessTokenCookie.cookie)

      return {
        ...user,
        token: accessTokenCookie.token
      };
    }

    @UseGuards(JwtAccessGuard)
    @Post('log-out') 
    async logout(@Req() request: RequestWithUser) {
      const userId = request.user['id'];
      await this.usersService.removeRefreshToken(userId);
      request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    }

    // todo Пока оставлю вопрос открытым. Нужен ли здесь гуард? 
    @Get('confirmed')
    async confirmedEmail(@Query() query) {
      const {email, oldEmail} = await this.authService.decodeConfirmationToken(query.token);

      // todo тут хорошо бы добавить логику обновления email на новый
      /*if(oldEmail) {
        return await this.authService.confirmUpdatedEmail(email, oldEmail);
      }*/

      return await this.usersService.confirmEmail(email);
    }

    //@UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(@Req() request: RequestWithUser) {
      // todo хм... почему не работает нотация через точку? 
      console.log(request, ' >>> request')
      if(!request.user) {
        //todo возможно, что тут надо выбрасывать ошибку, если нет пользователя
        return;
      }
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user['id']);
      request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
      console.log('TEST')
      return {
        ...request.user,
        token: accessTokenCookie.token
      };
    }
}
