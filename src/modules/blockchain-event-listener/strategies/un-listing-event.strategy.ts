
import { EventStrategy } from 'src/blockchains/libs/interface';
import { TransactionHistoryService } from 'src/modules/event-log-history/event-history.service';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import Web3 from 'web3';

export class UnListingEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    const { owner, nft, nftId, time } = event.args;
    const blockNumber = Number(event['log'].blockNumber);

    const canUpdate = await this.nftService.checkCanUpdateByBlockNumber(nft, nftId, blockNumber);
    if (!canUpdate) {
      console.log(`unListing Event skipped for tokenId: ${nftId}`);
      return;
    }
    await this.nftService.update(
      { tokenId: Number(nftId), collection_address: nft },
      {
        currency: '',
        price: 0,
        open_time: 0,
        nft_status: NFT_STATUS.AVAILABLE,
        block_number: blockNumber,
      }
    );

    console.log(`unListing handled successfully for tokenId: ${nftId}`);
  }


}