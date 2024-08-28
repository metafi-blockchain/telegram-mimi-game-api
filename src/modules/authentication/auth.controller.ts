import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query, Req,  Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { JwtAuthService } from './jwt.auth.service';
import { Request, Response } from 'express';
import { AuthAddressDto, AuthDto, IVerifyEmail } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService) {
  }








  
 

}
