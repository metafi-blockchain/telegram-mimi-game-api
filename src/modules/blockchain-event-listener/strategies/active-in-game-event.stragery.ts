
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class ActiveGameEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    const { user, nftAddress, nftId, feeContract, feeAmount, time } = event.args;
    const blockNumber = Number(event['log'].blockNumber);
    
    try {
        await this.nftService.updateStateNFT(user, nftAddress, nftId, blockNumber, {
            nft_status: NFT_STATUS.ACTIVE_IN_GAME
        });
        console.log(`Active Game Event handled successfully for tokenId: ${nftId}`);
        
        
    } catch (error) {
      console.log(`Active Game Event failed for tokenId: ${nftId}`);
      return;
        
    }
  }


}