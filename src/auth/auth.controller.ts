import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import RequestWithUser from 'src/interfaces/requestEithUser.interface';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './quards/local-auth.guard';
import JwtRefreshGuard from './quards/jwt-refresh.quard';
import LogInDto from './dto/log-in.dto';
import { Request } from 'express';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UserService
    ) {}

    @HttpCode(200)
    //@UseGuards(LocalAuthGuard)
    @Post('log-in')
    async logIn(@Req() request: Request, @Body() logInDto: LogInDto) {
      //todo впильть сюда проверки !) проверка на подтвержденный емайл
      console.log(logInDto, ' >>> request')
      let user = await this.usersService.getByEmail(logInDto.email);
      /*if(!user) {
        return;
      }*/
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
      const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user.id);
   
      user = await this.usersService.setCurrentRefreshToken(refreshTokenCookie.cookie, user.id);
   
      request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);
      console.log(request.res, ' >>> request.res')
      return user;
    }

    @Get('confirmed')
    async confirmedEmail(@Query() query) {
      console.log(query, ' >>> query')
      const {email, oldEmail} = await this.authService.decodeConfirmationToken(query.token);

      // todo тут хорошо бы добавить логику обновления email на новый
      /*if(oldEmail) {
        return await this.authService.confirmUpdatedEmail(email, oldEmail);
      }*/

      return await this.usersService.confirmEmail(email);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() request: RequestWithUser) {
        console.log(request, ' >>> request')
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id);
   
      request.res.setHeader('Set-Cookie', accessTokenCookie);
      return request.user;
    }
}
