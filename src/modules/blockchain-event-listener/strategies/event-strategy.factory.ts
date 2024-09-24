// strategies/event-strategy.factory.ts
import { MintEventStrategy } from './erc721-mint-event.strategy';
import { ListingEventStrategy } from './listing-event.strategy';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { UpdatePriceEventStrategy } from './pirce-update-event.strategy';
import { PurchaseEventStrategy } from './purchase-event.stragery';
import { ActiveGameEventStrategy } from './active-in-game-event.stragery';
import { DeActiveGameEventStrategy } from './de-active-game-event.stragery';
import { SetUpNFTEventStrategy } from './setup-nft-event.stragery';
import { NftTypesService } from 'src/modules/nft-types/nft-types.service';
import { UnListingEventStrategy } from './un-listing-event.strategy';
import { DepositEventStrategy } from './deposit-event.stragery';
import { AxiosHelperService } from '../axios-helper.service';
import { DepositRequestService } from 'src/modules/deposit-request/deposit-request.service';
import { DeployNFTCollectionEventStrategy } from './deploy-nft-collection-event';
import { EventStrategy } from 'src/interface';
import { TelegramService } from 'src/modules/telegram/telegram.service';


export class EventStrategyFactory {
  constructor(
    private readonly nftService: NftsService,
    private readonly nftTypeService: NftTypesService,
    private readonly axiosHelper: AxiosHelperService,
    private readonly depositService : DepositRequestService,
    private readonly telegramService: TelegramService,

  ) {}

  createStrategy(eventName: string): EventStrategy {
    switch (eventName) {
      case 'NFTMinted':
        return new MintEventStrategy(this.nftService, this.telegramService);
      case 'Listing':
        return new ListingEventStrategy(this.nftService);
      case 'UnListing':
        return new UnListingEventStrategy(this.nftService);
      case 'PriceUpdate':
        return new UpdatePriceEventStrategy(this.nftService);
      case 'Purchase':
        return new PurchaseEventStrategy(this.nftService);  
     case 'Active':
        return new ActiveGameEventStrategy(this.nftService, this.axiosHelper);  
     case 'Deactive':
        return new DeActiveGameEventStrategy(this.nftService, this.axiosHelper);   
     case 'SetNftSupport':
        return new SetUpNFTEventStrategy(this.nftTypeService);    
    case 'Deposit':
        return new DepositEventStrategy(this.axiosHelper, this.depositService);  
    case 'Deployed':
        return new DeployNFTCollectionEventStrategy(this.nftTypeService);
      // Add other strategies for different events here
      default:
        console.log(`No strategy found for event: ${eventName}`);
        return ;
        
    }
  }
}