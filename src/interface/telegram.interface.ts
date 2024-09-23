import TelegramBot from 'node-telegram-bot-api';

export interface CallbackQueryStrategy {
    handleCallbackQuery: (data: any, bot: TelegramBot) => Promise<void>;
}