import { NftTypesService } from "src/modules/nft-types/nft-types.service";
import { NftsService } from "src/modules/nfts/nfts.service";
import { TelegramRequestMintNftStrategy } from "./request-mint-nft.strategy";
import { CallbackQueryStrategy } from "src/interface";
import { MintRequestService } from "src/modules/mint-request/requests.service";
import { TelegramListingNftStrategy } from "./listing-nfts.strategy";
import { NftHelperService } from "src/modules/nfts/nft.helper.service";
import { TELEGRAM_QUERY } from "../telegram.constants";
import { TelegramUnListingNftStrategy } from "./un-listng-nft.strategy";



export  class CallBackTelegramStrategyFactory  {

    constructor(
        private nftService: NftsService,
        private nftTypeService: NftTypesService,
        private mintRequestService: MintRequestService,
        private nftHelperService: NftHelperService
    
      ) {}
      createStrategy(query_name: string): CallbackQueryStrategy {
        switch (query_name) {
          case TELEGRAM_QUERY.REQUEST_MINT_HERO:
            return new TelegramRequestMintNftStrategy(this.mintRequestService, this.nftTypeService ,this.nftService, this.nftHelperService);
          case TELEGRAM_QUERY.LISTING_HERO:
            return new TelegramListingNftStrategy(this.nftTypeService, this.nftService);
          case TELEGRAM_QUERY.UN_LISTING_HERO:
            return new TelegramUnListingNftStrategy(this.nftTypeService, this.nftService);  
          
          default:
            console.log(`No strategy found for event: ${query_name}`);
            return null;
            
        }
      }
}