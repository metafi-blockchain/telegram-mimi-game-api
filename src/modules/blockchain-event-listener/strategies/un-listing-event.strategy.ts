
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class UnListingEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) { }

  async handleEvent(event: any): Promise<void> {
    const { owner, nft, nftId, time } = event.returnValues;
    const blockNumber = Number(event.blockNumber);

    try {
      const result = await this.nftService.updateStateNFT( nft, nftId, blockNumber, {
        price: 0,
        open_time: 0,
        nft_status: NFT_STATUS.AVAILABLE,
      });
      if (result) {
        console.log(`unListing Event handled successfully for tokenId: ${nftId}`);
        return;
      }

    } catch (error) {
      console.log(`unListing Event failed for tokenId: ${nftId}`);
      return;
    }
  }


}