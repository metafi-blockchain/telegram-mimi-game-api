import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {

    private readonly token: string;
    private readonly chatId: string;
    constructor(private readonly configService: ConfigService ) {
        this.token = this.configService.get<string>('TELEGRAM_API_TOKEN');
        this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    }

   async sendMessage(message: string): Promise<boolean> {
    let result: boolean;
    await axios
      .get(
        `https://api.telegram.org/bot${this.token}/sendMessage`,
        {
          params: {
            chat_id: this.chatId,
            text: message,
          },
        },
      )
      .then(function (response) {
        result = true;
      })
      .catch(function (error) {
        result = false;
      });

    return result;
   }

}
