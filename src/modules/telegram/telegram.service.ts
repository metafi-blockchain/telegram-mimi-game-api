import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { ROLE } from '../users/user.entity';
import { NftTypesService } from '../nft-types/nft-types.service';
import { NftsService } from '../nfts/nfts.service';
import { CallBackTelegramStrategyFactory } from './callback-query-strategies/callback-handling.strategies';
import { MintRequestService } from '../mint-request/requests.service';
import { NftHelperService } from '../nfts/nft.hepler.service';

@Injectable()
export class TelegramService {
  private readonly telegramStrategyFactory: CallBackTelegramStrategyFactory;
  private readonly token: string;
  private bot: TelegramBot;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly collectionService: NftTypesService,
    private readonly nftService: NftsService,
    private readonly mintRequestService: MintRequestService,
    private readonly nftHelperService: NftHelperService,
  ) {
    this.token = this.configService.get<string>('TELEGRAM_API_TOKEN');
    this.telegramStrategyFactory = new CallBackTelegramStrategyFactory(
      this.nftService,
      this.collectionService,
      this.mintRequestService,
      this.nftHelperService,
    );

    this.initializeBot();
  }

  private initializeBot() {
    this.bot = new TelegramBot(this.token, { polling: true });

    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const telegramUser = await this.userService.findOneWithCondition({
        telegram_user: msg.from.username,
      });

      if (!telegramUser) {
        await this.bot.sendMessage(chatId, `Hello ${msg.from.first_name}, please register your account first.`);
        return;
      }

      await this.bot.sendMessage(chatId, `Hello ${telegramUser.role == 0 ? 'Admin ' : ' ' }${msg.from.first_name} , welcome back!`);

      if (telegramUser.role == ROLE.ADMIN) {
        this.sendInlineMenu(chatId);
        // this.sendAdminMenu(chatId);
      } else if (telegramUser.role == ROLE.USER) {
        await this.bot.sendMessage(chatId, 'You are a user');
        this.sendInlineMenu(chatId);
      }
    });

    this.bot.onText(/\/mint/, async (msg) => {
      const chatId = msg.chat.id;
      const telegramUser = await this.userService.findOneWithCondition({
        telegram_user: msg.from.username,
      });

      if (!telegramUser) return;

      console.log('Minting NFT for user:', msg);
      
    });

    this.bot.on('callback_query', async (query) => {
      await this.handleCallbackQuery(query);
    });

    // this.handleMenuSelection();
  }

  async sendMessage(chatId: string, message: string): Promise<boolean> {
    try {
      await axios.get(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        params: {
          chat_id: chatId,
          text: message,
        },
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async sendAdminMenu(chatId: number) {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Mint Hero', callback_data: 'MINT_HERO' },
            { text: 'List Hero', callback_data: 'LIST_HERO' },
          ],
          [{ text: 'Get Hero' }, { text: 'Menu 4' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    };

    await this.bot.sendMessage(chatId, 'Please select an option:', options);
  }

  async sendInlineMenu(chatId: number) {
    console.log('Sending inline menu');
    
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Visit Market Kingdoms', url: 'https://market.kingdoms.game' },
            { text: 'Mint Heroes', callback_data: 'MINT_HERO' },
          ],
          [{ text: 'Contact Support', callback_data: 'CONTACT_SUPPORT' }],
        ],
      },
    };
  
    try {
      await this.bot.sendMessage(chatId, 'Choose an option:', options);
    } catch (error) {
      console.error('Error sending inline menu:', error);
    }
  }

  async sendCustomMenu(chatId: number) {
    const options = {
      reply_markup: {
        keyboard: [
          [{ text: 'Option 1' }, { text: 'Option 2' }],
          [{ text: 'Option 3' }, { text: 'Option 4' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        selective: true,
      },
    };

    await this.bot.sendMessage(chatId, 'Please select an option:', options);
  }

  private async handleCallbackQuery(query: any) {
    const data = query.data;

    try {
      const strategy = this.telegramStrategyFactory.createStrategy(data);

      if (!strategy) {
        console.error(`No strategy found for event: ${data}`);
        return;
      }

      await strategy.handleCallbackQuery(query, this.bot);
    } catch (error) {
      console.error(`Error handling callback query ${data}:`, error);
    }
  }

  private async handleMenuSelection() {
    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      switch (text) {
        case 'Mint Hero':
          this.bot.sendMessage(chatId, 'You selected Mint Hero');
          break;
        case 'List Hero':
          this.bot.sendMessage(chatId, 'You selected Menu 2!');
          break;
        case 'Get Hero':
          this.bot.sendMessage(chatId, 'You selected Menu 3!');
          break;
        case 'Menu 4':
          this.bot.sendMessage(chatId, 'You selected Menu 4!');
          break;
      }
    });
  }
}