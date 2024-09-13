
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class UpdatePriceEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    const { owner, nft, nftId, oldPrice, newPrice, time } = event.args;
    const blockNumber = Number(event['log'].blockNumber);
    try {
      
     await this.nftService.updateStateNFT(owner, nft, nftId, blockNumber, {
      price: newPrice,
      open_time: Number(time),
    });
      console.log(`Update price Event handled successfully for tokenId: ${nftId}`);
    } catch (error) {
      console.log(`Update price Event failed for tokenId: ${nftId}`);
      return;
      
    }

    


  }


}