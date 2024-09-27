import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  ClassSerializerInterceptor,
  UseGuards,
  Request,
  BadRequestException,
  ConflictException,
  Req,
  BadGatewayException,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AdminGuard } from 'src/guards/admin.auth.guard';
import { randomBytes } from 'crypto';

import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { ConnectXDto } from './dtos/connect-x.dto';
import { TelegramAuthGuard } from 'src/guards/telegram-auth.guard';
import { getIncubationCanSpent } from 'src/utils';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      body?: any;
    }
  }
}

// @UseInterceptors(CurrentUserInterceptor)   //config one class
@UseGuards(TelegramAuthGuard)
@Serialize(UserDto)
@Controller('user')
export class UsersController {
  constructor(
    private userService: UsersService,

    private readonly configService: ConfigService,
  ) {}

  @Post('create-account')
  async createAccount(@Req() req, @Body() createAccountDto: CreateAccountDto) {
    const telegramId = req.telegram.user.id;
    return this.userService.createAccount(telegramId, createAccountDto);
  }

  @Put('increase-point')
  async increasePoint(@Req() req) {
    const telegramId = req.telegram.user.id;
    return this.userService.increasePoint(telegramId);
  }

  @Get('/me')
  async whoAmI(@Req() req) {
    const telegramId = req.telegram.user.id;
    const user = await this.userService.findByTelegramId(telegramId);
    const incubationCanSpent = getIncubationCanSpent(
      new Date().getTime(),
      user,
    );
    return { ...user, incubationCanSpent };
  }
}
