import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { NftTypesService } from '../nft-types/nft-types.service';
import { NftsService } from '../nfts/nfts.service';
import { TransactionHistoryService } from '../event-log-history/event-history.service';
import { EventStrategyFactory } from './strategies/event-strategy.factory';
import { ERC721Service } from 'src/blockchains/services/erc721.service';
import { MarketService } from 'src/blockchains/services/market-place.service';
import { GameService } from 'src/blockchains/services/game.service';
import { ContractType, GetEventParam, IPastEvent } from 'src/interface';
import { Queue } from 'src/blockchains/utils';

@Injectable()
export class BlockchainEventListenerService {
  private nodeRpcUrl: string;
  private eventStrategyFactory: EventStrategyFactory;

  constructor(
    private readonly configService: ConfigService,
    private nftService: NftsService,
    private nftTypService: NftTypesService,
    private transactionService: TransactionHistoryService,
  ) {
    this.nodeRpcUrl = this.configService.get<string>('WEB3_RPC_URL');
    this.eventStrategyFactory = new EventStrategyFactory(this.nftService, this.nftTypService);
  }



  async getPastEvents(data: GetEventParam, contractType: ContractType) {
    let serviceInstance : ERC721Service | MarketService | GameService;

    switch (contractType) {
      case 'erc721':
        serviceInstance = new ERC721Service(data.address, this.nodeRpcUrl);
        break;
      case 'marketplace':
        serviceInstance = new MarketService(data.address, this.nodeRpcUrl);
        break;
      case 'game':
        serviceInstance = new GameService(data.address, this.nodeRpcUrl);
        break;
      default:
        throw new Error('Invalid contract type');
    }

    try {
      const events = await serviceInstance.getAllPastEvents([data.fromBlock, data.toBlock]) as IPastEvent[];

      await this.processEvents(events);

    } catch (error) {
      console.error(`Error fetching past events for ${contractType} at ${data.address}:`, error);
    }
  }

  // Process events using strategy
  private async processEvents(events: IPastEvent[]) {

    const queue = new Queue<IPastEvent>();

    events.forEach(event => queue.push(event));
    
    while (queue.length() > 0) {
      const event = queue.pop();
      if (event) {
        try {
          await this.handleEvent(event.event, event);
        } catch (error) {
          console.error(`Error processing event ${event.event}:`, error);
        }
      }
      console.log('All events processed from the queue');
    }
  }

  // Handle a specific event by delegating to the corresponding strategy
  private async handleEvent(eventName: string, event: IPastEvent) {

    try {
      // Log the transaction
      this.transactionService.createTransactionHistory(event);

      // Get the event strategy
      const strategy = this.eventStrategyFactory.createStrategy(eventName);
      if (!strategy) {
        console.log(`No strategy found for event: ${eventName}`);
        return;
      }

      // Process the event using the strategy
      await strategy.handleEvent(event);
    } catch (error) {
      console.error(`Error handling event ${eventName}:`, error);
    }
  }
}

