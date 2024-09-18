
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class UpdatePriceEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) { }

  async handleEvent(event: any): Promise<void> {
    const { owner, nft, nftId, oldPrice, newPrice, time } = event.returnValues;
    const blockNumber = Number(event.blockNumber);
    try {

      const result = await this.nftService.updateStateNFT( nft, nftId, blockNumber, {
        price: newPrice,
        open_time: Number(time),
      });
      if (result) {
        console.log(`Update price Event handled successfully for tokenId: ${nftId}`);
        return;
      }
    } catch (error) {
      console.log(`Update price Event failed for tokenId: ${nftId}`);
      return;

    }




  }


}