
import { CallbackQueryStrategy } from 'src/interface';
import { MintRequestService } from 'src/modules/mint-request/requests.service';
import { NftTypesService } from 'src/modules/nft-types/nft-types.service';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import TelegramBot from 'node-telegram-bot-api';
import { isHeroGenValid } from 'src/utils';
import { isAddress } from 'ethers';
import { NftHelperService } from "src/modules/nfts/nft.helper.service";
import { getUserInput } from '../telegram.helper';

export class TelegramRequestMintNftStrategy implements CallbackQueryStrategy {
    constructor(
        private mintService: MintRequestService,
        private collectionService: NftTypesService,
        private nftService: NftsService,
        private nftHelperService: NftHelperService
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
          gensInput = await getUserInput(bot, chatId);
      
          // Validate gens input
          const arrGens = gensInput.split(',');
   
          const checkGensInput = await this.validGensUserInput(arrGens);

          if(checkGensInput !='ok'){
            await bot.sendMessage(chatId, checkGensInput);
            return;
          }
          
          // Prompt the user to input "reception"
          await bot.sendMessage(chatId, 'Please input reception:');
          
          // Wait for the second input (reception)
          reception = await getUserInput(bot, chatId);

          if(!isAddress(reception)){
            await bot.sendMessage(chatId, 'Invalid reception input. Please enter a valid value.');
            return;
          }

          await this.mintRequestHandling(arrGens, reception);
          await bot.sendMessage(chatId, 'Mint request created successfully.');
          
        } catch (error) {
          console.error('Error handling callback query:', error);
          await bot.sendMessage(chatId, 'An error occurred. Please try again later.');
        }
      }
      
;
      

      private async mintRequestHandling(gens: string[], reception: string){
        try {
          await this.mintService.createManyMintNftRequest(reception, gens);
          await this.nftHelperService.handleCreateHero();
          await this.nftHelperService.handleMintNfts();
        } catch (error) {
          console.log('Error in handleCreateHero:', error);

        }
      }


      private async validGensUserInput(gens: string[]): Promise<string> {
        const check = gens.every(isHeroGenValid);
        if (!check) return "Invalid gen input. Please enter a valid value.";

        const response = await this.mintService.findWithCondition({ gen: { $in: gens } })
        if (response.length > 0) {
          let genExits = await this.mintService.checkGensExits(gens);
          return `${genExits.join(";")} gen already exists`;
        }
        return 'ok';
      }
      
    
}