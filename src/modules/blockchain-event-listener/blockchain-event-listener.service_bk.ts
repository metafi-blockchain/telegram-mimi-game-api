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
import Web3 from 'web3';

@Injectable()
export class BlockchainEventListenerService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;
  private factoryContract: ethers.Contract;
  private depositContract: ethers.Contract;
  private marketPlaceContract: ethers.Contract;
  private gameContract: ethers.Contract;
  private web3: Web3;

  constructor(
    private readonly configService: ConfigService,
    private nftTypService: NftTypesService,
    private nftService: NftsService,
    private transactionService: TransactionHistoryService,
  ) {}

  async onModuleInit() {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const factoryContractAddress = this.configService.get<string>('NFT_FACTORY_ADDRESS');
    const depositContractAddress = this.configService.get<string>('DEPOSIT_CONTRACT_ADDRESS');
    const marketPlaceContractAddress = this.configService.get<string>('MARKET_PLACE_CONTRACT_ADDRESS');
    const gameContractAddress = this.configService.get<string>('GAME_CONTRACT_ADDRESS');

    this.web3 = new Web3(rpcUrl);
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Get all active NFT types and listen to NFT minting events
    const nftTypes = await this.nftTypService.findAllWithCondition({ status: 'DONE', is_active: true });
    await Promise.all(nftTypes.map((nftType) => this.listenToNftMintingEvents(nftType.nft_address)));

    this.listenToDepositEvents(depositContractAddress);
    this.listenToMarketPlaceEvents(marketPlaceContractAddress);
    this.listenToFactoryEvents(factoryContractAddress);
    this.listenToGameContractEvents(gameContractAddress);
  }

  private async listenToNftMintingEvents(contractAddress: string) {
    const erc721Contract = new ethers.Contract(contractAddress, erc721Abi.abi, this.provider);
    console.log('Listening for NFTMinted events from:', contractAddress);

    erc721Contract.on('NFTMinted', async (recipient, tokenId, uri, event) => {
      await this.processEvent(async () => {
        const blockNumber = Number(event['log'].blockNumber);
        await this.handleMintNftEvent({ recipient, tokenId, uri }, blockNumber);
        console.log(`NFT with tokenId: ${tokenId} successfully updated at block: ${blockNumber}`);
      }, event);
    });
  }

  private listenToDepositEvents(depositContractAddress: string) {
    this.depositContract = new ethers.Contract(depositContractAddress, depositAbi, this.provider);
    console.log('Listening for Deposit events at:', depositContractAddress);

    this.depositContract.on('Desposit', async (from, tokenAddress, amount, time, event) => {
      await this.processEvent(async () => {
        await this.handleDepositEvent(from, tokenAddress, amount, time);
      }, event);
    });
  }

  private listenToMarketPlaceEvents(marketPlaceContractAddress: string) {
    this.marketPlaceContract = new ethers.Contract(marketPlaceContractAddress, marketPlaceAbi, this.provider);
    console.log('Listening for Marketplace events at:', marketPlaceContractAddress);

    this.marketPlaceContract.on('SetNftSupport', async (nftAddress, isSupport, event) => {
      await this.processEvent(async () => {
        await this.handleSetNftSupportEvent(nftAddress, isSupport);
      }, event);
    });

    this.marketPlaceContract.on('Listing', async (ownerAddress, nftAddress, nftId, listingUserAddress, currency, listingPrice, listingTime, openTime, event) => {
      const data: ListingEvent = { ownerAddress, nftAddress, nftId, listingUserAddress, currency, listingPrice, listingTime, openTime };
      await this.processEvent(async () => this.handleListingNftEvent(data, Number(event['log'].blockNumber)), event);
    });

    this.marketPlaceContract.on('UnListing', async (ownerAddress, nftAddress, nftId, openTime, event) => {
      const data: UnListingEvent = { ownerAddress, nftAddress, nftId, time: openTime };
      await this.processEvent(async () => this.handleUnListingEvent(data, Number(event['log'].blockNumber)), event);
    });

    this.marketPlaceContract.on('PriceUpdate', async (ownerAddress, nftAddress, nftId, oldPrice, newPrice, openTime, event) => {
      const data: PriceUpdateEvent = { ownerAddress, nftAddress, nftId, oldPrice, newPrice, openTime };
      await this.processEvent(async () => this.handleUpdatePriceListingEvent(data, Number(event['log'].blockNumber)), event);
    });

    this.marketPlaceContract.on('Purchase', async (previousOwner, newOwner, nftAddress, nftId, currency, listingPrice, price, sellerAmount, commissionAmount, time, event) => {
      const data: PurchaseEvent = { previousOwner, newOwner, nftAddress, nftId, currency, listingPrice, price, sellerAmount, commissionAmount, time };
      await this.processEvent(async () => this.handlePurchaseNftEvent(data, Number(event['log'].blockNumber)), event);
    });
  }

  private listenToFactoryEvents(factoryContractAddress: string) {
    this.factoryContract = new ethers.Contract(factoryContractAddress, factoryAbi.abi, this.provider);
    console.log('Listening for Factory events at:', factoryContractAddress);

    this.factoryContract.on('Deployed', async (arg1, arg2, event) => {
      await this.processEvent(async () => this.handleDeployNftEvent(arg1, arg2), event);
    });
  }

  private listenToGameContractEvents(gameContractAddress: string) {
    this.gameContract = new ethers.Contract(gameContractAddress, gameContractAbi, this.provider);
    console.log('Listening for Game events at:', gameContractAddress);

    this.gameContract.on('Active', async (nftAddress, tokenId, user, feeContract, feeAmount, time, event) => {
      const data: ActiveGameEvent = { nftAddress, nftId: Number(tokenId), ownerAddress: user, feeContract: Number(feeContract), feeAmount: Number(feeAmount), time: Number(time) };
      await this.processEvent(async () => this.handleActiveGameEvent(data, Number(event['log'].blockNumber)), event);
    });

    this.gameContract.on('Deactive', async (nftAddress, tokenId, user, time, event) => {
      const data: DeActiveGameEvent = { nftAddress, nftId: Number(tokenId), ownerAddress: user, time: Number(time) };
      await this.processEvent(async () => this.handleDeActiveGameEvent(data, Number(event['log'].blockNumber)), event);
    });
  }

  private async handleMintNftEvent(data: MintNftEvent, block_number: number) {
    await this.nftService.update({ uri: data.uri }, {
      minting_status: MINT_STATUS.MINTED,
      nft_status: NFT_STATUS.AVAILABLE,
      tokenId: Number(data.tokenId),
      owner: data.recipient,
      block_number
    });
  }

  private async handleSetNftSupportEvent(nftAddress: string, isSupport: boolean) {
    await this.nftTypService.update({ nft_address: nftAddress }, { is_market_support: isSupport });
    console.log(`NFT at address ${nftAddress} support status set to ${isSupport}`);
  }

  private async handleListingNftEvent(data: ListingEvent, block_number: number) {
    await this.updateNftIfCan(data.nftAddress, data.nftId, block_number, {
      owner: data.ownerAddress,
      currency: data.currency,
      price: data.listingPrice,
      open_time: Number(data.openTime),
      nft_status: NFT_STATUS.LISTING_MARKET,
    });
  }

  private async handlePurchaseNftEvent(data: PurchaseEvent, block_number: number) {
    await this.updateNftIfCan(data.nftAddress, data.nftId, block_number, {
      owner: data.newOwner,
      currency: '',
      price: 0,
      open_time: 0,
      nft_status: NFT_STATUS.AVAILABLE,
    });
  }

  private async handleUnListingEvent(data: UnListingEvent, block_number: number) {
    await this.updateNftIfCan(data.nftAddress, data.nftId, block_number, {
      owner: data.ownerAddress,
      currency: '',
      price: 0,
      open_time: 0,
      nft_status: NFT_STATUS.AVAILABLE,
    });
  }

  private async handleUpdatePriceListingEvent(data: PriceUpdateEvent, block_number: number) {
    await this.updateNftIfCan(data.nftAddress, data.nftId, block_number, {
      price: data.newPrice,
      open_time: data.openTime,
    });
  }

  private async handleActiveGameEvent(data: ActiveGameEvent, block_number: number) {
    await this.updateNftIfCan(data.nftAddress, data.nftId, block_number, {
      nft_status: NFT_STATUS.ACTIVE_IN_GAME,
    });
  }

  private async handleDeActiveGameEvent(data: DeActiveGameEvent, block_number: number) {
    await this.updateNftIfCan(data.nftAddress, data.nftId, block_number, {
      nft_status: NFT_STATUS.AVAILABLE,
    });
  }

  private handleDepositEvent(from: string, tokenAddress: string, amount: string, time: string) {
    console.log(`Deposit event from: ${from} with amount: ${amount} at time: ${time}`);
  }

  private handleDeployNftEvent(arg1: string, arg2: string) {

  }

  // Utility function to update NFT if it passes block number validation
  private async updateNftIfCan(nftAddress: string, nftId: number, block_number: number, updateFields: Partial<any>) {
    // const canUpdate = await this.nftService.checkCanUpdateByBlockNumber(nftAddress, nftId, block_number);
    // if (!canUpdate) {
    //   console.log(`Cannot update NFT with tokenId: ${nftId} at block: ${block_number}`);
    //   return;
    // }
    await this.nftService.update({ tokenId: nftId, collection_address: nftAddress }, { ...updateFields, block_number });
  }

  private async handleCreateLogEventHistory(event: any) {
    try {
      const eventLog = event['log'];
      const transactionHash = eventLog['transactionHash'];
      if (!transactionHash) return;

      const tx = await this.web3.eth.getTransaction(transactionHash);
      await this.transactionService.create({
        transaction_hash: transactionHash,
        contract_address: eventLog['address'],
        from: tx.from,
        to: tx.to,
        value: Number(tx.value),
        block_hash: eventLog['blockHash'],
        block_number: eventLog['blockNumber'],
        event_type: event.filter,
        log_data: JSON.stringify(eventLog),
      });
    } catch (error) {
      console.error('Error creating log event history:', error);
    }
  }

  private async processEvent(eventHandler: () => Promise<void>, event: any) {
    try {
      await eventHandler();
      await this.handleCreateLogEventHistory(event);
      console.log(`Event processed successfully. Block: ${event['log'].blockNumber}`);
    } catch (error) {
      console.error('Error processing event:', error, 'Event:', event);
    }
  }
}