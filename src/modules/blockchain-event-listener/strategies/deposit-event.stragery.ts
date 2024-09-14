
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class DepositEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    const blockNumber = Number(event.blockNumber);
    const { from, token, amount, feeContract, uint256 } = event.returnValues;
    
    try {
    
        
    } catch (error) {
     
      return;
        
    }
  }


}