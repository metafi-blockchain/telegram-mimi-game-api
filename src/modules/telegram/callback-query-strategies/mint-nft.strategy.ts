
import { CallbackQueryStrategy } from 'src/interface';
import { MintRequestService } from 'src/modules/mint-request/requests.service';
import { NftTypesService } from 'src/modules/nft-types/nft-types.service';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import TelegramBot from 'node-telegram-bot-api';

export class TelegramMintNftStrategy implements CallbackQueryStrategy {
    constructor(
        private mintService: MintRequestService,
        private collectionService: NftTypesService,
        private nftService: NftsService,
    ) { }

    async handleCallbackQuery(callbackQuery: any, bot: TelegramBot): Promise<void> {
        const chatId = callbackQuery.message.chat.id;
        let gensInput: string;
        let reception: string;
      
        try {
          // Acknowledge the callback query to stop the loading spinner
          await bot.answerCallbackQuery(callbackQuery.id);
      
          // Prompt the user to input "gens"
          await bot.sendMessage(chatId, 'Please input gens:');
          
          // Wait for the first input (gens)
          gensInput = await this.getUserInput(bot, chatId);
      
          // Validate gens input
          if (!this.isValidGensInput(gensInput)) {
            await bot.sendMessage(chatId, 'Invalid gens input. Please enter a valid value.');
            return;
          }
          
          // Send confirmation for gens input
          await bot.sendMessage(chatId, `You entered gens: ${gensInput}`);
          
          // Prompt the user to input "reception"
          await bot.sendMessage(chatId, 'Please input reception:');
          
          // Wait for the second input (reception)
          reception = await this.getUserInput(bot, chatId);
      
          // Send confirmation for reception input
          await bot.sendMessage(chatId, `You entered reception: ${reception}`);
      
          // Do something with gensInput and reception
          console.log('Gens:', gensInput);
          console.log('Reception:', reception);
          
        } catch (error) {
          console.error('Error handling callback query:', error);
          await bot.sendMessage(chatId, 'An error occurred. Please try again later.');
        }
      }
      
      // Helper function to get input from the user
      private getUserInput(bot: TelegramBot, chatId: number): Promise<string> {
        return new Promise((resolve) => {
          bot.once('message', (msg) => {
            if (msg.chat.id === chatId) {
              resolve(msg.text); // Resolve the user's input
            }
          });
        });
      }
      
      // Example validation function for gens input
      private isValidGensInput(input: string): boolean {
        // Add your validation logic here (e.g., check if the input is a number)
        return !isNaN(Number(input)) && Number(input) > 0; // Example: only allow positive numbers
      }
}