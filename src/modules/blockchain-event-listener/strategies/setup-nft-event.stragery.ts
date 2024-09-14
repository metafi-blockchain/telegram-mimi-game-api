
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NftTypesService } from 'src/modules/nft-types/nft-types.service';

export class SetUpNFTEventStrategy implements EventStrategy {
  constructor(
    private nftTypeService: NftTypesService,

  ) {}

  async handleEvent(event: any): Promise<void> {
    const { nft, isSupport } = event.returnValues;
    try {
        await this.nftTypeService.update({ nft_address: nft }, { is_market_support: isSupport });
        console.log(`NFT at address ${nft} support status set to ${isSupport}`);
      
    } catch (error) {
        console.log(`NFT at address ${nft} support status failed to set to ${isSupport}`);
        return;
    }
  }


}