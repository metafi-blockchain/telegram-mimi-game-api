
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class UnListingEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    const { owner, nft, nftId, time } = event.args;
    const blockNumber = Number(event['log'].blockNumber);

    try {
      await this.nftService.updateStateNFT(owner, nft, nftId, blockNumber, {
        price: 0,
        open_time: 0,
        nft_status: NFT_STATUS.AVAILABLE,
      });
      console.log(`unListing Event handled successfully for tokenId: ${nftId}`);
      
    } catch (error) {
      console.log(`unListing Event failed for tokenId: ${nftId}`);
      return;
    }
  }


}