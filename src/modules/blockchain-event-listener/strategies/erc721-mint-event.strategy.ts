
import { EventStrategy } from 'src/blockchains/libs/interface';
import { MINT_STATUS, NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class MintEventStrategy implements EventStrategy {
  constructor(
    private nftService: NftsService,
  ) {}

  async handleEvent(event: any): Promise<void> {
    const { recipient, tokenId, uri } = event.args;
    console.log(`MintEvent handled for tokenId: ${tokenId}`);
    
    const blockNumber = Number(event['log'].blockNumber);

    await this.nftService.update({ uri }, {
      minting_status: MINT_STATUS.MINTED,
      nft_status: NFT_STATUS.AVAILABLE,
      tokenId: Number(tokenId),
      owner: recipient,
      block_number: blockNumber
    });
    console.log(`MintEvent handled successfully for tokenId: ${tokenId}`);
  }


}