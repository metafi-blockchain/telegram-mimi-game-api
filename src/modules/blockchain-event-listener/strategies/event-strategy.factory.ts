// strategies/event-strategy.factory.ts
import { MintEventStrategy } from './erc721-mint-event.strategy';
import { ListingEventStrategy } from './listing-event.strategy';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { EventStrategy } from 'src/blockchains/libs/interface';
import { UpdatePriceEventStrategy } from './pirce-update-event.strategy';
import { PurchaseEventStrategy } from './purchase-event.stragery';
import { ActiveGameEventStrategy } from './active-in-game-event.stragery';
import { DeActiveGameEventStrategy } from './de-active-game-event.stragery';
import { SetUpNFTEventStrategy } from './setup-nft-event.stragery';
import { NftTypesService } from 'src/modules/nft-types/nft-types.service';
import { UnListingEventStrategy } from './un-listing-event.strategy';

export class EventStrategyFactory {
  constructor(
    private nftService: NftsService,
    private nftTypeService: NftTypesService,
  ) {}

  createStrategy(eventName: string): EventStrategy {
    switch (eventName) {
      case 'NFTMinted':
        return new MintEventStrategy(this.nftService);
      case 'Listing':
        return new ListingEventStrategy(this.nftService);
      case 'UnListing':
        return new UnListingEventStrategy(this.nftService);
      case 'PriceUpdate':
        return new UpdatePriceEventStrategy(this.nftService);
      case 'Purchase':
        return new PurchaseEventStrategy(this.nftService);  
     case 'Active':
        return new ActiveGameEventStrategy(this.nftService);  
     case 'Deactive':
        return new DeActiveGameEventStrategy(this.nftService);   
     case 'SetNftSupport':
        return new SetUpNFTEventStrategy(this.nftTypeService);      
      // Add other strategies for different events here
      default:
        console.log(`No strategy found for event: ${eventName}`);
        return null;
        
    }
  }
}