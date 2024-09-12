import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import factoryAbi from '../../blockchains/abis/EnteralKingdomNFTFactory2.json';
import depositAbi from '../../blockchains/abis/EnterKingDomDeposit.json';
import marketPlaceAbi from '../../blockchains/abis/EnteralKingDomMarketplace.json';
import gameContractAbi from '../../blockchains/abis/EnteralKingDomGame.json';
import { ConfigService } from '@nestjs/config';
import { NftTypesService } from '../nft-types/nft-types.service';
import erc721Abi from '../../blockchains/abis/EnteralKingDomERC721.json';
import { NftsService } from '../nfts/nfts.service';
import { MINT_STATUS, NFT_STATUS } from '../nfts/nft.entity';
import { ActiveGameEvent, DeActiveGameEvent, ListingEvent, MintNftEvent, PriceUpdateEvent, PurchaseEvent, UnListingEvent } from 'src/interface';
import { TransactionHistoryService } from '../event-log-history/event-history.service';
import { EventStrategyFactory } from './strategies/event-strategy.factory';

@Injectable()
export class BlockchainEventListenerService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;

  private eventStrategyFactory: EventStrategyFactory;

  constructor(
    private readonly configService: ConfigService,
    private nftService: NftsService,
    private nftTypService: NftTypesService,
    private transactionService: TransactionHistoryService
  ) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Initialize the strategy factory
    this.eventStrategyFactory = new EventStrategyFactory(this.nftService);
  }

  async onModuleInit() {
    const factoryContractAddress = this.configService.get<string>('NFT_FACTORY_ADDRESS');
    const depositContractAddress = this.configService.get<string>('DEPOSIT_CONTRACT_ADDRESS');
    const marketPlaceContractAddress = this.configService.get<string>('MARKET_PLACE_CONTRACT_ADDRESS');
    const gameContractAddress = this.configService.get<string>('GAME_CONTRACT_ADDRESS');
    const nftTypes = await this.nftTypService.findAllWithCondition({ status: 'DONE', is_active: true });
    
    await Promise.all(nftTypes.map((nftType) => {
    
      const erc721Address = nftType.nft_address;
      if (!erc721Address)  return;
      console.log();
      
      const erc721Contract = new ethers.Contract(erc721Address, erc721Abi.abi, this.provider);
      erc721Contract.on('NFTMinted', async (_recipient, _tokenId, _uri, event) => {
        console.log('NFTMinted event:', event.args);
        await this.handleEvent('NFTMinted', event)
      });

    }));

    
    const marketPlaceContract = new ethers.Contract(marketPlaceContractAddress, marketPlaceAbi, this.provider);

    // Register listeners for different events
   


    marketPlaceContract.on('Listing', async (_owner, _nft, _nftId, _listing, _currency, _listingPrice, _listingTime, _openTime, event) => {
      await this.handleEvent('Listing', event)
    });
    marketPlaceContract.on('UnListing', async (_owner, _nfts, _nftId, _openTime, event) => {
      console.log('UnListing event:', event.args);
      await this.handleEvent('UnListing', event)
    });
    marketPlaceContract.on('PriceUpdate', async (_owner, _nft, _nftId, _oldPrice, _newPrice, _time, event) => {
      console.log('PriceUpdate event:', event.args);
      await this.handleEvent('PriceUpdate', event)
    });

    marketPlaceContract.on('Purchase', async (_owner, _nft, _nftId, _oldPrice, _newPrice, _time, event) => {
      console.log('Purchase event:', event.args);
      await this.handleEvent('Purchase', event)
    });




    // Register other event listeners here
  }

  private async handleEvent(eventName: string, event: any) {
    try {
      //Create transaction history
      this.transactionService.createTransactionHistory(event);
      // Create the appropriate strategy for the event
      const strategy = this.eventStrategyFactory.createStrategy(eventName);

      // Delegate the handling of the event to the strategy
      await strategy.handleEvent(event);

    } catch (error) {
      console.error(`Error handling event ${eventName}:`, error);
    }
  }
}