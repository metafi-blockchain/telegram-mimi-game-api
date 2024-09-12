
import { EventStrategy } from 'src/blockchains/libs/interface';
import { MINT_STATUS, NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';


export class PurchaseEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    const { previousOwner, newOwner, nft,  nftId} = event.args;
    console.log(`Purchase handled for tokenId: ${nftId}`);
    
    const blockNumber = Number(event['log'].blockNumber);
    const canUpdate = await this.nftService.checkCanUpdateByBlockNumber(nft, nftId, blockNumber);
    if (!canUpdate) {
      console.log(`Purchase Event skipped for tokenId: ${nftId}`);
      return;
    }
    await this.nftService.update(
        { tokenId: Number(nftId), collection_address: nft, owner: previousOwner },
        {
          owner: newOwner,
          price: 0,
          open_time: 0,
          block_number: blockNumber,
          nft_status: NFT_STATUS.AVAILABLE,
        }
      );
    console.log(`Purchase handled successfully for tokenId: ${nftId}`);
  }


}