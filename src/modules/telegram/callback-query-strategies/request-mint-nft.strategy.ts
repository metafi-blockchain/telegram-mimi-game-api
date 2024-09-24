
import { CallbackQueryStrategy } from 'src/interface';
import { MintRequestService } from 'src/modules/mint-request/requests.service';
import { NftTypesService } from 'src/modules/nft-types/nft-types.service';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import TelegramBot from 'node-telegram-bot-api';
import { isHeroGenValid } from 'src/utils';
import { isAddress } from 'ethers';
import { NftHelperService } from 'src/modules/nfts/nft.hepler.service';

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
          gensInput = await this.getUserInput(bot, chatId);
      
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
          reception = await this.getUserInput(bot, chatId);

          if(!isAddress(reception)){
            await bot.sendMessage(chatId, 'Invalid reception input. Please enter a valid value.');
            return;
          }
          await this.createMintRequest(arrGens, reception);
          await bot.sendMessage(chatId, 'Mint request created successfully.');
          
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

      private async createMintRequest(gens: string[], reception: string){
        //create many mint request 
        await this.mintService.createManyMintNftRequest(reception, gens);

        //handle mint request
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