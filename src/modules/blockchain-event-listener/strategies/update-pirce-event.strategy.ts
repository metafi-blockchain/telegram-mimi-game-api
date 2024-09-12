
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

    const canUpdate = await this.nftService.checkCanUpdateByBlockNumber(nft, nftId, blockNumber);
    if (!canUpdate) {
      console.log(`Update price Event skipped for tokenId: ${nftId}`);
      return;
    }
    await this.nftService.update(
      { tokenId: Number(nftId), collection_address: nft, owner },
      {
        price: newPrice,
        open_time: Number(time),
        block_number: blockNumber,
      }
    );

    console.log(`Update price Event handled successfully for tokenId: ${nftId}`);
  }


}