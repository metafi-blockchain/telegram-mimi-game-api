// src/auth/guards/telegram-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // For accessing TOKEN_TELEGRAM
import { Request } from 'express';
import { parse, validate } from '@telegram-apps/init-data-node';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['telegramauth'];

    if (!authHeader) {
      throw new UnauthorizedException('Telegram auth header not provided');
    }

    try {
      const TOKEN_TELEGRAM = this.configService.get<string>('TOKEN_TELEGRAM');
      const initData = `${authHeader ?? ''}`.split(' ').pop();

      validate(initData ?? '', TOKEN_TELEGRAM, { expiresIn: 0 });

      const telegram = parse(initData);

      if (!telegram?.user || telegram?.user?.isBot) {
        throw new ForbiddenException('Invalid Telegram user');
      }

    //   const blockIds = [
    //     '1218689869',
    //     '6620874607',
    //     '5186301440',
    //     '7122009907',
    //     '7068883782',
    //     '6360027950',
    //   ];

    //   if (blockIds.includes(telegram.user.id.toString())) {
    //     throw new ForbiddenException('Your account has been suspended');
    //   }

      // Attach telegram info to the request
      request['telegram'] = telegram;
      return true;
    } catch (error) {
      throw new ForbiddenException('Telegram authentication failed');
    }
  }
}