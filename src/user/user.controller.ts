import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';
import { UserService } from './user.service';
import JwtAccessGuard from 'src/auth/quards/jwt-access.guard';
import UpdateUserDto from './dto/updateUser.dto';

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      const user = await this.userService.create(createUserDto);
      await this.userService.sendVerificationLink(createUserDto.email, null);
      return user;
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
      /*const user = await this.userService.getUserById(id); // todo ваще не оч понятно стоит ли эту логику оставить тут или пенести в сервисы
      if(user.email !== createUserDto.email) {
        await this.authService.sendVerificationLink(createUserDto.email);
      }*/
      
      return this.userService.updateUser(id, updateUserDto);
    }

    // todo этот метод мне не нужен, проверял JwtAccessGuard, работает успешно
    /*
    @UseGuards(JwtAccessGuard)
    @Get()
    async getAll() {
      return await this.userService.getAll();
    }*/
}
