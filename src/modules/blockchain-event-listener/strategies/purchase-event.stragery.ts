
import { EventStrategy } from 'src/blockchains/libs/interface';
import { MINT_STATUS, NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';


export class PurchaseEventStrategy implements EventStrategy {
    constructor(
        private nftService: NftsService,
    ) { }

    async handleEvent(event: any): Promise<void> {
        const { previousOwner, newOwner, nft, nftId } = event.returnValues;
        console.log(`Purchase handled for tokenId: ${nftId}`);

        const blockNumber = Number(event.blockNumber);

        const result = await this.nftService.updateStateNFT( nft, nftId, blockNumber, {
            owner: newOwner,
            price: 0,
            open_time: 0,
            block_number: blockNumber,
            nft_status: NFT_STATUS.AVAILABLE,
        })
        if (result) {
            console.log(`Purchase handled successfully for tokenId: ${nftId}`);
            return;
        }
    }


}