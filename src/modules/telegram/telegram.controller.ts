import { Controller, Get, Res, Req, UseFilters } from '@nestjs/common';
import { Response, Request } from 'express';
import { TelegramService } from './telegram.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('telegram')
@UseFilters(HttpExceptionFilter)  // Apply the error filter globally to this controller
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get()
  getInitData(@Req() req: Request, @Res() res: Response) {
    const initData = res.locals.initData;
    if (!initData) {
      return res.status(401).json({ error: 'Init data not found, user is not authorized' });
    }
    res.json(initData);
  }
}