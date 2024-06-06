import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';
import { UserService } from './user.service';
import JwtAccessGuard from 'src/auth/quards/jwt-access.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      const user = await this.userService.create(createUserDto);
      await this.userService.sendVerificationLink(createUserDto.email, null);
      //todo добаивть вызвод ошибки, если пользователь с таким емайлом уже существует 
      return user;
    }

    // todo этот метод мне не нужен, проверял JwtAccessGuard, работает успешно
    /*
    @UseGuards(JwtAccessGuard)
    @Get()
    async getAll() {
      return await this.userService.getAll();
    }*/
}
