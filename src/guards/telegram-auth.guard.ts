// src/auth/guards/telegram-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // For accessing TOKEN_TELEGRAM
import { Request } from 'express';
import { parse, validate } from '@telegram-apps/init-data-node';
import { TOKEN_TELEGRAM_DURATION } from 'src/constants/telegram';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['Authorization'] || request.headers['authorization'];

    // We expect passing init data in the Authorization header in the following format:
  // <auth-type> <auth-data>
  // <auth-type> must be "tma", and <auth-data> is Telegram Mini Apps init data.
    const [authType, authData = ''] = (request.header('authorization') || '').split(' ');
    console.log(`authType`, authType);
    console.log(`authData`, authData);    

    if (!authHeader) {
      throw new UnauthorizedException('Telegram auth header not provided');
    }

    try {
      const TOKEN_TELEGRAM = this.configService.get<string>('TELEGRAM_API_TOKEN');
      const initData = `${authHeader ?? ''}`.split(' ').pop();

      console.log(`TOKEN_TELEGRAM`, TOKEN_TELEGRAM);
    
      

      validate(authData ?? '', TOKEN_TELEGRAM, { expiresIn: TOKEN_TELEGRAM_DURATION });

      const telegram = parse(initData);

      console.log(`telegram`, telegram);
      

      if (!telegram?.user || telegram?.user?.isBot) {
        throw new ForbiddenException('Invalid Telegram user');
      }

      request['telegram'] = telegram;
      return true;
    } catch (error) {
      console.log(`error`, error);
      
      throw new ForbiddenException('Telegram authentication failed');
    }
  }
}