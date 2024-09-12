// strategies/listing-event.strategy.ts
import { NftsService } from '../nfts/nfts.service';
import { TransactionHistoryService } from '../event-log-history/event-history.service';
import { NFT_STATUS } from '../nfts/nft.entity';
import Web3 from 'web3';
import { EventStrategy } from 'src/blockchains/libs/interface';

export class GameEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
    private transactionService: TransactionHistoryService,
    private web3: Web3
  ) {}

  async handleEvent(event: any): Promise<void> {
    const { ownerAddress, nftAddress, nftId, listingPrice, openTime, currency } = event.args;
    const blockNumber = Number(event['log'].blockNumber);

    await this.nftService.update(
      { tokenId: nftId, collection_address: nftAddress },
      {
        owner: ownerAddress,
        currency,
        price: listingPrice,
        open_time: Number(openTime),
        nft_status: NFT_STATUS.LISTING_MARKET,
        block_number: blockNumber,
      }
    );

    await this.logTransaction(event);
    console.log(`ListingEvent handled successfully for tokenId: ${nftId}`);
  }

  private async logTransaction(event: any) {
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
  }
}