import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import factoryAbi from '../../blockchains/abis/EnteralKingdomNFTFactory2.json';
import depositAbi from '../../blockchains/abis/EnterKingDomDeposit.json';
import marketPlaceAbi from '../../blockchains/abis/EnteralKingDomMarketplace.json';
import { ConfigService } from '@nestjs/config';
import { NftTypesService } from '../nft-types/nft-types.service';
import erc721Abi from '../../blockchains/abis/EnteralKingDomERC721.json';
import { NftsService } from '../nfts/nfts.service';
import { MINT_STATUS, NFT_STATUS } from '../nfts/nft.entity';
import { ListingEvent, MintNftEvent, PriceUpdateEvent, PurchaseEvent, UnListingEvent } from 'src/interface';
import { TransactionHistoryService } from '../event-log-history/event-history.service';
import  { Web3 } from 'web3';

@Injectable()
export class BlockchainEventListenerService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;
  private factoryContract: ethers.Contract;
  private depositContract: ethers.Contract;
  private marketPlaceContract: ethers.Contract;
  private rpcUrl : string;


  constructor(
    private readonly configService: ConfigService,
    private nftTypService: NftTypesService,
    private nftService: NftsService,
    private transactionService: TransactionHistoryService,
  ) { }

  async onModuleInit() {
    this.rpcUrl = this.configService.get<string>('RPC_URL');
    const factoryContractAddress = this.configService.get<string>('NFT_FACTORY_ADDRESS');
    const depositContractAddress = this.configService.get<string>('DEPOSIT_CONTRACT_ADDRESS');
    const marketPlaceContractAddress = this.configService.get<string>('MARKET_PLACE_CONTRACT_ADDRESS');
 
    // Connect to provider
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);

    // Get all active NFT types
    const nftTypes = await this.nftTypService.findAllWithCondition({status: 'DONE', is_active: true,});

    // Listen for NFT minting events
    await Promise.all(nftTypes.map(async (nftType) => this.listenToNftMintingEvents(nftType.nft_address)));

    // Listen for Deposit contract events
    this.listenToDepositEvents(depositContractAddress);

    // Listen for Marketplace contract events
    this.listenToMarketPlaceEvents(marketPlaceContractAddress);

    // Listen for Factory contract events
    this.listenToFactoryEvents(factoryContractAddress);
  }

  // Function to handle NFT Minting events
  private async listenToNftMintingEvents(contractAddress: string) {
    console.log('Listening for events from NFT:', contractAddress);

    const erc721Contract = new ethers.Contract(contractAddress, erc721Abi.abi, this.provider);
    erc721Contract.on('NFTMinted', (recipient, tokenId, uri, event) => {
      console.log('Full event data:', event);
      console.log('tokenId:', tokenId);
      this.handleMintNftEvent({ recipient, tokenId, uri }, event);
      this.handleCreateLogEventHistory(event);
    });
  }

  // Function to listen to Deposit contract events
  private listenToDepositEvents(depositContractAddress: string) {
    this.depositContract = new ethers.Contract(depositContractAddress, depositAbi, this.provider);
    console.log('Listening for Deposit events at:', depositContractAddress);

    this.depositContract.on('Desposit', (from, tokenAddress, amount, time, event) => {
      console.log('Full deposit event data:', event.log);
      // Add deposit event handling logic here
      this.handleDepositEvent(from, tokenAddress, amount, time);
      this.handleCreateLogEventHistory(event);
    });
  }

  // Function to listen to Marketplace contract events
  private listenToMarketPlaceEvents(marketPlaceContractAddress: string) {
    this.marketPlaceContract = new ethers.Contract(marketPlaceContractAddress, marketPlaceAbi, this.provider);
    console.log('Listening for Marketplace events at:', marketPlaceContractAddress);

    // Uncomment to handle specific Marketplace events
    this.marketPlaceContract.on('SetNftSupport', async (nftAddress, isSupport, event) => {
     await this.handleSetNftSupportEvent(nftAddress, isSupport, event);
     await this.handleCreateLogEventHistory(event);
    });

    //listing event Listing(address ownerAddress, address nftAddress, uint256 nftId, address listingUserAddress, string currency, uint256 listingPrice, uint256 listingTime, uint256 openTime);
    this.marketPlaceContract.on('Listing', async (ownerAddress: string, nftAddress: string, nftId: number, listingUserAddress: string, currency: string,listingPrice: number, listingTime: number, openTime: number, event: any) => {
      const data = { ownerAddress, nftAddress,  nftId,  listingUserAddress, currency,  listingPrice, listingTime,  openTime,} as ListingEvent;
      await this.handleListingNftEvent(data, event);
      await this.handleCreateLogEventHistory(event);
    });
    // listing event UnListing(address ownerAddress, address nftAddress, uint256 nftId, uint256 time);
    this.marketPlaceContract.on('UnListing', async (ownerAddress: string, nftAddress: string, nftId: number,  openTime: number, event: any) => {
      const data = { ownerAddress, nftAddress,  nftId , time: openTime} as UnListingEvent;
      await this.handleUnListingEvent(data, event);
      await this.handleCreateLogEventHistory(event);
    });

    this.marketPlaceContract.on('PriceUpdate', async (ownerAddress: string, nftAddress: string, nftId: number,  oldPrice: number, newPrice, openTime, event: any) => {
      const data = { ownerAddress, nftAddress,  nftId , openTime, newPrice, oldPrice} as PriceUpdateEvent;
      await this.handleUpdatePriceListingEvent(data, event);
      await this.handleCreateLogEventHistory(event);

    });

    //listing event Purchase(address previousOwner, address newOwner, address nftAddress, uint256 nftId, string currency, uint256 listingPrice, uint256 price, uint256 sellerAmount, uint256 commissionAmount, uint256 time);
    this.marketPlaceContract.on('Purchase', async (previousOwner: string, newOwner: string, nftAddress: string, nftId: number, currency: string, listingPrice: number, price: number, sellerAmount: number, commissionAmount: number, time: number, event: any) => {
      const data = { previousOwner, newOwner, nftAddress, nftId, currency, listingPrice, price, sellerAmount, commissionAmount, time } as PurchaseEvent;
      await this.handlePurchaseNftEvent(data, event);
      await this.handleCreateLogEventHistory(event);
    });
  }

  // Function to listen to Factory contract events
  private listenToFactoryEvents(factoryContractAddress: string) {
    this.factoryContract = new ethers.Contract(factoryContractAddress, factoryAbi.abi, this.provider);
    console.log('Listening for Factory events at:', factoryContractAddress);

    this.factoryContract.on('Deployed', (arg1, arg2, event) => {
      this.handleDeployNftEvent(arg1, arg2, event);
      this.handleCreateLogEventHistory(event);
    });
  }

  // Function to handle deployment event from Factory contract
  private async handleDeployNftEvent(arg1: any, arg2: any, event: any) {
    console.log('Handling deployment event:', arg1, arg2);
    // Add deployment handling logic here
  }

  // Function to handle NFT mint event
  private async handleMintNftEvent(data: MintNftEvent, event: any) {
    // console.log('Full mint data:', data);
    await this.nftService.update({ uri: data.uri }, {
      minting_status: MINT_STATUS.MINTED,
      nft_status: NFT_STATUS.AVAILABLE,
      tokenId: Number(data.tokenId),
      owner: data.recipient,
    });
    await this.handleCreateLogEventHistory(event);
    // Add transaction history logic here if needed
  }

  private handleDepositEvent(from: string, tokenAddress: string, amount: number, packageId: number) {
    //save to transaction history
    // Add deposit event handling logic here
  }


  private async handleSetNftSupportEvent(nftAddress: string, isSupport: boolean, event: any) {
    // Add set NFT support event handling logic here
   await this.nftTypService.update({ nft_address: nftAddress }, { is_market_support: isSupport });
    console.log('Set NFT support event:', event.log);
  }

  private async handleListingNftEvent(data: ListingEvent, event: any) {
    console.log(' Listing event:', event.log);
    const { nftAddress, nftId, ownerAddress, currency, listingPrice, openTime } = data;
    await  this.nftService.update({ tokenId: nftId, collection_address: nftAddress }, {
      owner: ownerAddress,
      currency,
      price: listingPrice,
      open_time: openTime,
      nft_status: NFT_STATUS.LISTING_MARKET,
    })
  }

  private async handlePurchaseNftEvent(data: PurchaseEvent, event: any) {
    console.log('Purchase event:', event.log);
    const { nftAddress, nftId, newOwner } = data;
    this.nftService.update({ tokenId: nftId, collection_address: nftAddress }, {
      owner: newOwner,
      currency: "",
      price: 0,
      open_time: 0,
      nft_status: NFT_STATUS.AVAILABLE,
    })
  }
  private async handleUnListingEvent(data: UnListingEvent, event: any) {
    console.log('UnListing event:', event.log);
    const { nftAddress, nftId, ownerAddress } = data;
    await this.nftService.update({ tokenId: nftId, collection_address: nftAddress, owner: ownerAddress }, {
      currency: "",
      price: 0,
      open_time: 0,
      nft_status: NFT_STATUS.AVAILABLE,
    })
  }

  private async handleUpdatePriceListingEvent(data: PriceUpdateEvent, event: any) {
    console.log('Price Update event:', event.log);
    const { nftAddress, nftId, ownerAddress, newPrice, openTime } = data;
    await this.nftService.update({ tokenId: nftId, collection_address: nftAddress, owner: ownerAddress }, {
        price: newPrice,
        open_time: openTime,
    })
  }

  private async handleCreateLogEventHistory( event: any) {
    try {
      console.log('Create log event');
    const web3 = new Web3(this.rpcUrl);
    const transactionHash = event['transactionHash'];

    const tx = await web3.eth.getTransaction(transactionHash);

    const eventLog = event['log'];
    await this.transactionService.create({
      transaction_hash: transactionHash,
      contract_address: eventLog['address'],
      from: tx.from,
      to: tx.to,
      value: tx.value,
      block_hash: eventLog['blockHash'],
      block_number: eventLog['blockNumber'],
      event_type: event.filter,
      log_data: JSON.stringify(eventLog),

    }); 
    } catch (error) {
      console.log('Error create log event:', error);
    }
    
    // Add transaction history logic here
  }

  


}