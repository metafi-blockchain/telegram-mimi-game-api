
import TelegramBot from 'node-telegram-bot-api';


// Helper function to get input from the user
export function getUserInput(bot: TelegramBot, chatId: number): Promise<string> {
    return new Promise((resolve) => {
      bot.once('message', (msg) => {
        if (msg.chat.id === chatId) {
          resolve(msg.text); // Resolve the user's input
        }
      });
    });
  }