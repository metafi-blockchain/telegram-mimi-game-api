
import { CallbackQueryStrategy } from 'src/interface';
import { MintRequestService } from 'src/modules/mint-request/requests.service';
import { NftTypesService } from 'src/modules/nft-types/nft-types.service';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import TelegramBot from 'node-telegram-bot-api';
import { isHeroGenValid } from 'src/utils';
import { isAddress } from 'ethers';
import { NftHelperService } from 'src/modules/nfts/nft.hepler.service';
import { getUserInput } from '../helper';

export class TelegramListingNftStrategy implements CallbackQueryStrategy {
    constructor(
        private nftService: NftsService,
        private nftHelperService: NftHelperService
    ) { }

    async handleCallbackQuery(callbackQuery: any, bot: TelegramBot): Promise<void> {

        const chatId = callbackQuery.message.chat.id;

        let tokenInput: string;
        let reception: string;
      
        try {
          // Acknowledge the callback query to stop the loading spinner
          await bot.answerCallbackQuery(callbackQuery.id);
      
          // Prompt the user to input "tokens"
          await bot.sendMessage(chatId, 'Please input tokens id:');
          
          // Wait for the first input (gens)
          tokenInput = await getUserInput(bot, chatId);
      

          
          
          // Prompt the user to input "reception"
          await bot.sendMessage(chatId, 'Please input reception:');
          
          // Wait for the second input (reception)
          reception = await getUserInput(bot, chatId);

          if(!isAddress(reception)){
            await bot.sendMessage(chatId, 'Invalid reception input. Please enter a valid value.');
            return;
          }

          await bot.sendMessage(chatId, 'Mint request created successfully.');
          
        } catch (error) {
          console.error('Error handling callback query:', error);
          await bot.sendMessage(chatId, 'An error occurred. Please try again later.');
        }
      }
      
     

      
    
}