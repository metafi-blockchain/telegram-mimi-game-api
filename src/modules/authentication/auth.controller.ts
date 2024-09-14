import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, Post, Query, Req,  Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { JwtAuthService } from './jwt.auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService) {
  }

  @Post('login')
  async login(@Body() authDto: AuthDto, @Res() res: Response) {
    const user = await this.userService.finOneWithCondition({email: authDto.email});

    if (!user)   throw new NotFoundException('email or password is incorrect');

    const token = await this.jwtAuthService.login(authDto.email, authDto.password);

    return res.json(token);
  }

  @Post('signup')
  async signup(@Body() authDto: AuthDto, @Res() res: Response) {
    const users = await this.userService.find({email: authDto.email})
    if (users.length) 
        throw new ConflictException("Email in use!");

    const token = await this.jwtAuthService.signup(authDto.email, authDto.password);

    return res.json({ token });
  
  }

}
