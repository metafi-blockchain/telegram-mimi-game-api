
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { AxiosHelperService } from '../axios-helper.service';
import { ActiveGame } from 'src/interface';
import { GAME_ENDPOINT } from 'src/constants/game.endpoint';
import { Logger } from '@nestjs/common';

export class ActiveGameEventStrategy implements EventStrategy {

    private readonly logger = new Logger(ActiveGameEventStrategy.name);

    constructor(
        private nftService: NftsService,
        private readonly axiosHelper: AxiosHelperService


    ) { }

    async handleEvent(event: any): Promise<void> {
        const { user, nftAddress, nftId, feeContract, feeAmount, time } = event.returnValues;
        const blockNumber = Number(event.blockNumber);

        try {
            this.logger.log(`Handle ${user} active game tokenId: ${nftId} at block ${blockNumber}`);
            const result = await this.nftService.updateStateNFT(nftAddress, nftId, blockNumber, { nft_status: NFT_STATUS.ACTIVE_IN_GAME });

            if (result) {
                const nft = await this.nftService.findOneWithCondition({ tokenId: Number(nftId) });

                const data = {
                    "tokenId": Number(nftId),
                    "heroId": nft.attributes.find((attr) => attr.trait_type === 'Hero Id').value as number,
                    "walletAddress": user,
                    "blockNumber": blockNumber,
                    "action": "Active"
                } as ActiveGame;

                const result = await this.handleUseActiveInGame(data);

                if (!result) return;

                this.logger.log(`${user} call deActive to game with tokenId ${nftId} failed at block ${blockNumber} successfully`);

                return;
            }
        } catch (error) {

            this.logger.error(`${user} call active to game with tokenId ${nftId} failed at block ${blockNumber}`, error);
            console.log(error);
            return;

        }
    }
    private async handleUseActiveInGame(data: ActiveGame) {
        try {
            console.log('data', data);
            

            this.logger.log(`${data.walletAddress} call active to game with token: ${data.tokenId} at block ${data.blockNumber}`);

            await this.axiosHelper.post(GAME_ENDPOINT.HERO, data);
            
            this.logger.log(`${data.walletAddress} call active to game with token: ${data.tokenId} at block ${data.blockNumber} success`);
           
            await this.nftService.updateStateInGame({ nftAddress: data.collectionAddress, nftId: data.tokenId, blockNumber: data.blockNumber }, true);

            return true

        } catch (error) {
            this.logger.error(`${data.walletAddress} call active to game with token: ${data.tokenId} at block ${data.blockNumber} failed`, error);
            console.error('Error active in game:', error);
            return false;
        }

    }


}