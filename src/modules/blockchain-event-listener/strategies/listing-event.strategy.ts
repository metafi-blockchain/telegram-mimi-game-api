
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class ListingEventStrategy implements EventStrategy {
    constructor(
        private nftService: NftsService,
    ) { }

    async handleEvent(event: any): Promise<void> {
        const { owner, nft, nftId, currency, listingPrice, openTime } = event.returnValues
        const blockNumber = Number(event.blockNumber);


        try {
            const result = await this.nftService.updateStateNFT(owner, nft, nftId, blockNumber, {
                owner: owner,
                currency,
                price: listingPrice,
                open_time: Number(openTime),
                nft_status: NFT_STATUS.LISTING_MARKET
            });
            if (result) {
                console.log(`ListingEvent handled successfully for tokenId: ${nftId}`);
                return;
            }
        } catch (error) {
            console.log(`ListingEvent failed for tokenId: ${nftId}`);
            return;
        }
    }
}