
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class ListingEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    const { previousOwner, newOwner, nft, nftId, currency, listingPrice, openTime } = event.args;
    const blockNumber = Number(event['log'].blockNumber);

   const canUpdate = await this.nftService.checkCanUpdateByBlockNumber(nft, nftId, blockNumber);
    if (!canUpdate) {
      console.log(`ListingEvent skipped for tokenId: ${nftId}`);
      return;
    }

    await this.nftService.update(
      { tokenId: Number(nftId), collection_address: nft },
      {
        owner: newOwner,
        currency,
        price: listingPrice,
        open_time: Number(openTime),
        nft_status: NFT_STATUS.LISTING_MARKET,
        block_number: blockNumber,
      }
    );

    console.log(`ListingEvent handled successfully for tokenId: ${nftId}`);
  }
}