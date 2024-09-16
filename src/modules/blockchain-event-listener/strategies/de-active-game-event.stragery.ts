
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class DeActiveGameEventStrategy implements EventStrategy {
    constructor(
        private nftService: NftsService,
    ) { }

    async handleEvent(event: any): Promise<void> {
        const { user, nftAddress, nftId, feeContract, feeAmount, time } = event.returnValues;
        const blockNumber = Number(event.blockNumber);

        try {
            const result = await this.nftService.updateStateNFT(user, nftAddress, nftId, blockNumber, {
                nft_status: NFT_STATUS.AVAILABLE
            });
            if (result) {
                console.log(`DeActive Game Event handled successfully for tokenId: ${nftId}`);
                return;
            }
        } catch (error) {
            console.log(`DeActive Game Event failed for tokenId: ${nftId}`);
            return;

        }
    }


}