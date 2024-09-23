import { AxiosHelperService } from "src/modules/blockchain-event-listener/axios-helper.service";
import { NftTypesService } from "src/modules/nft-types/nft-types.service";
import { NftsService } from "src/modules/nfts/nfts.service";
import { TelegramMintNftStrategy } from "./mint-nft.strategy";
import { CallbackQueryStrategy } from "src/interface";
import { MintRequestService } from "src/modules/mint-request/requests.service";



export  class CallBackTelegramStrategyFactory  {

    constructor(
        private nftService: NftsService,
        private nftTypeService: NftTypesService,
        private mintRequestService: MintRequestService,
    
      ) {}
      createStrategy(query_name: string): CallbackQueryStrategy {
        switch (query_name) {
          case 'MINT_HERO':
            return new TelegramMintNftStrategy(this.mintRequestService, this.nftTypeService ,this.nftService);
          
          default:
            console.log(`No strategy found for event: ${query_name}`);
            return null;
            
        }
      }
}