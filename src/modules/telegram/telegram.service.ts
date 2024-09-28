import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { validate, parse, type InitDataParsed } from '@telegram-apps/init-data-node';
import { TOKEN_TELEGRAM_DURATION } from 'src/constants/telegram';



@Injectable()
export class TelegramService {
  private readonly token: string;
  private bot: TelegramBot;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    
    this.token = this.configService.get<string>('TELEGRAM_API_TOKEN');


    this.initializeBot();
  }



  private initializeBot() {
    this.bot = new TelegramBot(this.token, { polling: true });

    // this.bot.onText(/\/start/, async (msg) => {
    //   const chatId = msg.chat.id;
    //   const telegramUser = await this.userService.findOneWithCondition({
    //     telegram_user: msg.from.username,
    //   });

    //   if (!telegramUser) {
    //     await this.bot.sendMessage(chatId, `Hello ${msg.from.first_name}, please register your account first.`);
    //     return;
    //   }


     
    // });

    
    // this.handleMenuSelection();
  }

  validateInitData(authData: string): boolean {
    try {
      validate(authData, this.token, {
        expiresIn: TOKEN_TELEGRAM_DURATION, // Valid for 1 hour
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  parseInitData(authData: string): InitDataParsed {
    return parse(authData);
  }













}