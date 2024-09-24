import { AxiosHelperService } from "src/modules/blockchain-event-listener/axios-helper.service";
import { NftTypesService } from "src/modules/nft-types/nft-types.service";
import { NftsService } from "src/modules/nfts/nfts.service";
import { TelegramRequestMintNftStrategy } from "./request-mint-nft.strategy";
import { CallbackQueryStrategy } from "src/interface";
import { MintRequestService } from "src/modules/mint-request/requests.service";
import { NftHelperService } from "src/modules/nfts/nft.hepler.service";



export  class CallBackTelegramStrategyFactory  {

    constructor(
        private nftService: NftsService,
        private nftTypeService: NftTypesService,
        private mintRequestService: MintRequestService,
        private nftHelperService: NftHelperService
    
      ) {}
      createStrategy(query_name: string): CallbackQueryStrategy {
        switch (query_name) {
          case 'MINT_HERO':
            return new TelegramRequestMintNftStrategy(this.mintRequestService, this.nftTypeService ,this.nftService, this.nftHelperService);
          
          default:
            console.log(`No strategy found for event: ${query_name}`);
            return null;
            
        }
      }
}