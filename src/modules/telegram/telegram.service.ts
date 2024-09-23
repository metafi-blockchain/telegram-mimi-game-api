import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

import axios from 'axios';
import { UsersService } from '../users/users.service';
import { ROLE } from '../users/user.entity';
import { NftTypesService } from '../nft-types/nft-types.service';

@Injectable()
export class TelegramService {

    private readonly token: string;
    private bot: TelegramBot;

    constructor(private readonly configService: ConfigService,
      private readonly userService: UsersService, 
      private readonly collectionService: NftTypesService

     ) {
        this.token = this.configService.get<string>('TELEGRAM_API_TOKEN');

        this.bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, { polling: true });
        this.bot.onText(/\/start/,async (msg) => {
          console.log('Received /start command');
          const chatId = msg.chat.id;
          const teleGramUser = await this.userService.findOneWithCondition({telegram_user: msg.from.username});
         
          if(!teleGramUser) {
            this.bot.sendMessage(chatId, `Hello ${msg.from.username}, please register your account first`);
            return
          }
          this.bot.sendMessage(chatId, `Hello ${msg.from.username}, welcome back!`);
          
          
          if(teleGramUser.role === ROLE.ADMIN){
            this.bot.sendMessage(chatId, `You are an admin`);
            this.sendMenu(chatId);
          }
          if(teleGramUser.role === ROLE.USER){
            this.bot.sendMessage(chatId, `You are a user`);
            this.sendInlineMenu(chatId);
          }
          
         
          
          
        });

        this.bot.on('callback_query', (query) => {
          console.log('Received callback query');
          console.log(query);
          
          const chatId = query.message.chat.id;
          const data = query.data;
          
          switch (data) {
            case 'get_info':
              this.bot.sendMessage(chatId, 'Getting info...');
              break;
            case 'contact_support':
              this.bot.sendMessage(chatId, 'Contacting support...');
              break;
            default:
              this.bot.sendMessage(chatId, 'Unknown command.');
              break;
          }
        })
    }

   async sendMessage(chatId: string, message: string): Promise<boolean> {
    let result: boolean;
    await axios
      .get(
        `https://api.telegram.org/bot${this.token}/sendMessage`,
        {
          params: {
            chat_id: chatId,
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
   // Method to send the menu buttons
  async sendMenu(chatId: number) {
    const options = {
      reply_markup: {
        keyboard: [
          [{ text: 'Mint Hero' }, { text: 'List Hero' }],
          [{ text: 'Menu 3' }, { text: 'Menu 4' }],
        ],
        resize_keyboard: true, // Adjust size
        one_time_keyboard: false, // Keep the menu active after selection
      },
    };

    await this.bot.sendMessage(chatId, 'Please select an option:', options);
  }
  async sendInlineMenu(chatId: number) {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Visit market kingdoms', url: 'https://market.kingdoms.game' },
            { text: 'Get Info', callback_data: 'get_info' },
          ],
          [
            { text: 'Contact Support', callback_data: 'contact_support' },
          ],
        ],
      },
    };
  
    await this.bot.sendMessage(chatId, 'Choose an option:', options);
  }
  async sendCustomMenu(chatId: number) {
    const options = {
      reply_markup: {
        keyboard: [
          [{ text: 'Option 1' }, { text: 'Option 2' }],
          [{ text: 'Option 3' }, { text: 'Option 4' }],
        ],
        resize_keyboard: true, // Makes the keyboard fit the screen size
        one_time_keyboard: true, // Hides the keyboard after the user selects an option
        selective: true, // Only show the keyboard to specific users (if needed)
      },
    };
  
    await this.bot.sendMessage(chatId, 'Please select an option:', options);
  }

  // Set up more handlers here to listen to specific menu choices
  async handleMenuSelection() {
    this.bot.on('message', (msg) => {
      console.log('Received message');
      console.log(msg);
      
      const chatId = msg.chat.id;
      const text = msg.text;

      // Handle menu button actions
      switch (text) {
        case 'Menu 1':
          this.bot.sendMessage(chatId, 'You selected Menu 1!');
          break;
        case 'Menu 2':
          this.bot.sendMessage(chatId, 'You selected Menu 2!');
          break;
        case 'Menu 3':
          this.bot.sendMessage(chatId, 'You selected Menu 3!');
          break;
        case 'Menu 4':
          this.bot.sendMessage(chatId, 'You selected Menu 4!');
          break;
        default:
          this.bot.sendMessage(chatId, 'Unknown command.');
          break;
      }
    });
  }

}
