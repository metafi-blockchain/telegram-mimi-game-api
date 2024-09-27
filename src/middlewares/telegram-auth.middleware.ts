import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TelegramService } from 'src/modules/telegram/telegram.service';

@Injectable()
export class TelegramAuthMiddleware implements NestMiddleware {
  constructor(private readonly telegramService: TelegramService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header('authorization') || '';
    const [authType, authData = ''] = authHeader.split(' ');

    if (authType !== 'tma' || !authData) {
      throw new UnauthorizedException('Unauthorized: Invalid or missing authorization header');
    }

    if (!this.telegramService.validateInitData(authData)) {
      throw new UnauthorizedException('Invalid init data');
    }

    const initData = this.telegramService.parseInitData(authData);
    res.locals.initData = initData; // Store initData in res.locals for future access

    next(); // Continue to the next middleware or route handler
  }
}