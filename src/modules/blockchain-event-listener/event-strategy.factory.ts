// strategies/event-strategy.factory.ts


import { NftsService } from '../nfts/nfts.service';
import { TransactionHistoryService } from '../event-log-history/event-history.service';
import Web3 from 'web3';
import { EventStrategy } from 'src/blockchains/libs/interface';
import { ERC721EventStrategy } from './erc721-event.strategy.ts';
import { MarketEventStrategy } from './market-event.strategy';

export class EventStrategyFactory {
  constructor(
    private nftService: NftsService,
    private transactionService: TransactionHistoryService,
    private web3: Web3
  ) {}

  createStrategy(eventName: string): EventStrategy {
    switch (eventName) {
      case 'NFTMinted':
        return new ERC721EventStrategy(this.nftService, this.transactionService, this.web3);
      case 'Listing':
        return new MarketEventStrategy(this.nftService, this.transactionService, this.web3);
      // Add other strategies for different events here
      default:
        throw new Error(`No strategy found for event: ${eventName}`);
    }
  }
}