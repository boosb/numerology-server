
import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Param, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './quards/local-auth.guard';
import JwtRefreshGuard from './quards/jwt-refresh.quard';
import JwtAccessGuard from './quards/jwt-access.guard';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';

@Controller('api/auth')
//@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UserService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUser) {
      const { user } = request;
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user['id']);
      const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user['id']);
   
      await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user['id']);
   
      request.res.setHeader('Set-Cookie', [accessTokenCookie.cookie, refreshTokenCookie.cookie]);
      request.res.cookie('Refresh', refreshTokenCookie.token);

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
      const {email, oldEmail, userId} = await this.authService.decodeConfirmationToken(query.token);

      // todo тут хорошо бы добавить логику обновления email на новый
      /*if(oldEmail) {
        return await this.authService.confirmUpdatedEmail(email, oldEmail);
      }*/

      return await this.usersService.confirmEmailAndGetUser(email);
    }

   // @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    @HttpCode(201)
    async refresh(@Req() request: RequestWithUser, @Res() res) {
      // todo хм... почему не работает нотация через точку?
      if (!request.user) {
        await res.status(200).send();
        throw new BadRequestException('User PNH');
      }
      
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user['id']);
      console.log(accessTokenCookie, ' >>>> accessTokenCookie')
      if(!accessTokenCookie.token) {
        console.log('1')
        throw new BadRequestException('User is not auth');
      }
      request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
      return {
        ...request.user,
        token: accessTokenCookie.token
      };
    }
}
