// strategies/event-strategy.factory.ts
import { MintEventStrategy } from './mint-event.strategy';
import { ListingEventStrategy } from './listing-event.strategy';

import Web3 from 'web3';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { TransactionHistoryService } from 'src/modules/event-log-history/event-history.service';
import { EventStrategy } from 'src/blockchains/libs/interface';

export class EventStrategyFactory {
  constructor(
    private nftService: NftsService,
    private transactionService: TransactionHistoryService,
    private web3: Web3
  ) {}

  createStrategy(eventName: string): EventStrategy {
    switch (eventName) {
      case 'NFTMinted':
        return new MintEventStrategy(this.nftService, this.transactionService, this.web3);
      case 'Listing':
        return new ListingEventStrategy(this.nftService, this.transactionService, this.web3);
      // Add other strategies for different events here

      case 'Listing':
        return new ListingEventStrategy(this.nftService, this.transactionService, this.web3);
      // Add other strategies for different events here
      default:
        throw new Error(`No strategy found for event: ${eventName}`);
    }
  }
}