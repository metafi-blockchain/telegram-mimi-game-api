
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { AxiosHelperService } from '../axios-helper.service';
import { GAME_ENDPOINT } from 'src/constants/game.endpoint';
import { ActiveGame } from 'src/interface';
import { Logger  } from '@nestjs/common';

export class DeActiveGameEventStrategy implements EventStrategy {

    private readonly logger = new Logger(DeActiveGameEventStrategy.name);

    constructor(
        private nftService: NftsService,
        private readonly axiosHelper: AxiosHelperService

    ) { }

    async handleEvent(event: any): Promise<void> {
        const { user, nftAddress, nftId, feeContract, feeAmount, time } = event.returnValues;
        const blockNumber = Number(event.blockNumber);

        try {
            const result = await this.nftService.updateStateNFT(nftAddress, nftId, blockNumber, {
                nft_status: NFT_STATUS.AVAILABLE
            });
            if (result) {
                const nft = await this.nftService.findOneWithCondition({ tokenId: Number(nftId), collection_address: nftAddress });
                const data = {
                    "tokenId": Number(nftId),
                    "heroId": nft.attributes.find((attr) => attr.trait_type === 'Hero Id').value as number,
                    "walletAddress": user,
                    "blockNumber": blockNumber,
                    "action": "Deactive"
                } as ActiveGame;
                
                const result =  await this.useActiveInGame(data);

                if (!result) return;
                   
                this.logger.log(`${user} call deActive to game with tokenId ${nftId} at block ${blockNumber} successfully`);

                console.log(`DeActive Game Event handled successfully for tokenId: ${nftId}`);

                return;
            }
        } catch (error) {
            this.logger.error(`${user} Call deActive to game with tokenId ${nftId} failed at block ${blockNumber}`, error);
            console.log(error);
            return; 

        }
    }

    private async useActiveInGame(data: ActiveGame) {
        try {
            this.logger.log(`${data.walletAddress} call deActive to game with token: ${data.tokenId} at block ${data.blockNumber}`);
            const result = await this.axiosHelper.post(GAME_ENDPOINT.HERO, data);
            this.logger.log(`${data.walletAddress} call deActive to game with token: ${data.tokenId} at block ${data.blockNumber} response: ${result}`);
            await this.nftService.updateStateInGame( {nftAddress: data.collectionAddress, nftId: data.tokenId, blockNumber: data.blockNumber}, false);
            return true 
        } catch (error) {
            this.logger.error(`${data.walletAddress} call deActive to game with tokenId: ${data.tokenId}  at block ${data.blockNumber} error`, error.response);

            console.error('Error deActive in game:', error);
            return false;

        }
    }


}
