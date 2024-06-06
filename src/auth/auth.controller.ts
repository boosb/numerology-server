import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './quards/local-auth.guard';
import JwtRefreshGuard from './quards/jwt-refresh.quard';
import LogInDto from './dto/log-in.dto';
import { Request } from 'express';
import JwtAccessGuard from './quards/jwt-access.guard';
import UserDto from './dto/user.dto';

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
    async logIn(@Req() request: Request, @Body() logInDto: LogInDto) {
      let user = await this.usersService.getByEmail(logInDto.email);
      if(!user) {
        return;
      }
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
      const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user.id);
   
      user = await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);
   
      request.res.setHeader('Set-Cookie', [accessTokenCookie.cookie, refreshTokenCookie.cookie]);
      request.res.cookie('Refresh', refreshTokenCookie.token)

      return {
        ...user,
        token: accessTokenCookie.token
      };
    }

    @UseGuards(JwtAccessGuard)
    @Post('log-out') 
    async logout(@Req() request: Request, @Body() userDto: UserDto) {
      console.log(request, ' >>> request-1')
      console.log(userDto, ' >>> userDto-1')
      await this.usersService.removeRefreshToken(userDto.userId);
      request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    }

    @Get('confirmed')
    async confirmedEmail(@Query() query) {
      //console.log(query, ' >>> query')
      const {email, oldEmail} = await this.authService.decodeConfirmationToken(query.token);

      // todo тут хорошо бы добавить логику обновления email на новый
      /*if(oldEmail) {
        return await this.authService.confirmUpdatedEmail(email, oldEmail);
      }*/

      return await this.usersService.confirmEmail(email);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() request: Request, @Body() userDto: UserDto) {
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(userDto.userId);
   
      request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
      return request.user;
    }
}
