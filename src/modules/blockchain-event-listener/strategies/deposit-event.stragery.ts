import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { AxiosHelperService } from '../axios-helper.service';
import { GAME_ENDPOINT } from 'src/constants/game.endpoint';
import { DepositRequestService } from 'src/modules/deposit-request/deposit-request.service';
import { Injectable, NestMiddleware, Logger, HttpStatus } from '@nestjs/common';
import { DEPOSIT_STATUS } from 'src/modules/deposit-request/deposit.entity';


export class DepositEventStrategy implements EventStrategy {
    private readonly logger = new Logger(DepositEventStrategy.name);
    constructor(
        private readonly axiosHelper: AxiosHelperService,
        private readonly depositService: DepositRequestService,
    ) { }

    async handleEvent(event: any): Promise<void> {

        const blockNumber = Number(event.blockNumber);
        const { from, token, amount, id, time } = event.returnValues;
        const packageId = Number(id);
        this.logger.log(`Handle ${from} deposit packageId: ${id}`);
        try {
            const result = await this.depositService.handleDepositRequest({
                from: from,
                token: token,
                amount: Number(amount),
                id: packageId,
                time: Number(time),
                blockNumber: blockNumber,
                transactionHash: event.transactionHash,
            });
            if (!result) return;

            await this.userDeposit({
                packageId: packageId,
                walletAddress: from,
                blockNumber: blockNumber,
                transactionHash: event.transactionHash,
            });

        } catch (error) {
            console.log(error);
        }
    }

    private async userDeposit(data: DepositGame) {

        try {
            this.logger.log(`Call ${data.walletAddress} deposit to game with packageId: ${data.packageId}`);
            const result = await this.axiosHelper.post(GAME_ENDPOINT.DEPOSIT, data);
            if (result) {
                await this.depositService.update({
                    packageId: data.packageId,
                    wallet: data.walletAddress,
                    block_number: data.blockNumber,
                    transactionHash: data.transactionHash,
                }, { status: DEPOSIT_STATUS.DONE });
            }
            this.logger.log(`Call ${data.walletAddress} deposit to game with packageId: ${data.packageId} success`);
        } catch (error) {
            this.logger.error(`Call ${data.walletAddress} deposit to game with packageId: ${data.packageId}  error`, error.toString());
            this.depositService.update({
                packageId: data.packageId,
                wallet: data.walletAddress,
                block_number: data.blockNumber,
                transactionHash: data.transactionHash,
            }, { status: DEPOSIT_STATUS.ERROR });
            console.error('Error call depositing to game:', error);
        }

    }
}

type DepositGame = {
    packageId: number;
    walletAddress: string;
    blockNumber: number;
    transactionHash: string;
};
