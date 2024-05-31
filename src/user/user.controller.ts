import { Body, Controller, Post } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto, ' >>> createUserDto')
      const user = await this.userService.create(createUserDto);
      await this.userService.sendVerificationLink(createUserDto.email, null);
      //todo добаивть вызвод ошибки, если пользователь с таким емайлом уже существует 
      return user;
    }
}
