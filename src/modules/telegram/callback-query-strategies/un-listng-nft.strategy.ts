
import { CallbackQueryStrategy } from 'src/interface';
import { NftTypesService } from 'src/modules/nft-types/nft-types.service';
import { NftsService } from 'src/modules/nfts/nfts.service';
import TelegramBot from 'node-telegram-bot-api';
import { getUserInput } from '../telegram.helper';

export class TelegramUnListingNftStrategy implements CallbackQueryStrategy {
    constructor(
        private nftTypeService: NftTypesService,
        private nftService: NftsService,
    ) { }

    async handleCallbackQuery(callbackQuery: any, bot: TelegramBot): Promise<void> {

        const chatId = callbackQuery.message.chat.id;

        let tokenInput: string;
      
        try {
          // Acknowledge the callback query to stop the loading spinner
          await bot.answerCallbackQuery(callbackQuery.id);
      
          // Prompt the user to input "tokens"
          await bot.sendMessage(chatId, 'Please input tokens id:');
          
          // Wait for the first input (gens)
          tokenInput = await getUserInput(bot, chatId);

          const tokenIds = tokenInput.split(',').map(tokenId => parseInt(tokenId));

          const collection = await this.nftTypeService.findOneWithCondition({ collection_type: 'hero' });
          console.log('collection', collection);

            if (!collection) {
                await bot.sendMessage(chatId, 'Collection not found.');
                return;
            }
            const collectionAddress = collection.nft_address;

            const result = await this.nftService.unlistNfts(tokenIds, collectionAddress);

            const tx = result.transactionHash;
            await bot.sendMessage(chatId, `Unlisting NFTs with tokenIds ${tokenIds.join(', ')} successfully. Transaction: ${tx}`);
          
        } catch (error) {
          console.error('Error handling callback query:', error);
          await bot.sendMessage(chatId, 'An error occurred. Please try again later.');
        }
      }
      
     

      
    
}