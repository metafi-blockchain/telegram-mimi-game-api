// strategies/event-strategy.factory.ts
import { MintEventStrategy } from './erc721-mint-event.strategy';
import { ListingEventStrategy } from './listing-event.strategy';

import Web3 from 'web3';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { TransactionHistoryService } from 'src/modules/event-log-history/event-history.service';
import { EventStrategy } from 'src/blockchains/libs/interface';
import { UpdatePriceEventStrategy } from './update-pirce-event.strategy';
import { PurchaseEventStrategy } from './purchase-event.stragery';

export class EventStrategyFactory {
  constructor(
    private nftService: NftsService,
  ) {}

  createStrategy(eventName: string): EventStrategy {
    switch (eventName) {
      case 'NFTMinted':
        return new MintEventStrategy(this.nftService);
      case 'Listing':
        return new ListingEventStrategy(this.nftService);
      case 'UnListing':
        return new ListingEventStrategy(this.nftService);
      case 'PriceUpdate':
        return new UpdatePriceEventStrategy(this.nftService);
      case 'Purchase':
        return new PurchaseEventStrategy(this.nftService);  
      // Add other strategies for different events here
      default:
        throw new Error(`No strategy found for event: ${eventName}`);
    }
  }
}