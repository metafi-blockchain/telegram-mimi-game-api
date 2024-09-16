
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class DepositEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    const blockNumber = Number(event.blockNumber);
    const { from, token, amount, id, time } = event.returnValues;

    console.log(`DepositEvent handled for tokenId: ${id}`);
    
    try {
    
        
    } catch (error) {
     
      return;
        
    }
  }


}