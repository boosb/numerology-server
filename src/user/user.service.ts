import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './dto/createUser.dto';
import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { VerificationTokenPayload } from 'src/interfaces/verificationTokenPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    private nodemailerTransport: Mail;

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
      this.nodemailerTransport = createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: configService.get('EMAIL_USER'),
          pass: configService.get('EMAIL_PASSWORD'),
        }
      });
    }

    async create(сreateUserDto: CreateUserDto) {
      const existUser = await this.usersRepository.findOne({
        where: {
          email: сreateUserDto.email
        }
      });
  
      if(existUser) {
        throw new BadRequestException('This email already exist!');
      }
  
      const user = await this.usersRepository.save({
        email: сreateUserDto.email,
        //name: сreateUserDto.name,
        password: await bcrypt.hash(сreateUserDto.password, 10),
      });
    }

    public sendVerificationLink(email: string, oldEmail: string | null) {
      const payload: VerificationTokenPayload = { email, oldEmail };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
      });
   
      const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
   
      const text = `Welcome to the application Quiz. To confirm the email address, click here ${url}`;
  
      return this._sendMail({
        from: this.configService.get('EMAIL_USER'),
        to: email,
        subject: 'Email confirmation',
        text,
      });
    }

    async _sendMail(options: Mail.Options) {
      try {
        return await this.nodemailerTransport.sendMail(options);
      } catch (error) {
        throw new BadRequestException('The server was unable to send the message!');
      }
    }

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersRepository.update(userId, {
          currentHashedRefreshToken
        });

        return await this.usersRepository.findOne({ where: { id: userId } });
    }

    async getById(id: number) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (user) {
          return user;
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async getByEmail(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
          throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
        }
        return  user;
    }
     
    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const user = await this.getById(userId);
     
        const isRefreshTokenMatching = await bcrypt.compare(
          refreshToken,
          user.currentHashedRefreshToken
        );
     
        if (isRefreshTokenMatching) {
          return user;
        }
    }

    public async confirmEmail(email: string) {
      const user = await this.getByEmail(email);
      if (user.isConfirmed) {
        throw new BadRequestException('Email already confirmed!');
      }
  
      await this.markEmailAsConfirmed(email);
  
      return await this.getByEmail(email);
    }

    public async markEmailAsConfirmed(email: string) {
      return this.usersRepository.update({ email }, {
        isConfirmed: true
      });
    }
}
