import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NftTypesService } from '../nft-types/nft-types.service';
import { Queue } from 'src/blockchains/utils';
import { BlockchainEventListenerService } from '../blockchain-event-listener/blockchain-event-listener.service';
import { ConfigService } from '@nestjs/config';
import { OracleConfigsService } from '../configs/oracle-configs.service';
import { Web3Service } from '../web3/web3.service';
import { ScannerErrorsService } from '../scanner-errors/scanner-errors.service';
import { SCAN_STATUS, ScannerError } from '../scanner-errors/scanner-error.entity';
import { NftHelperService } from '../nfts/nft.helper.service';

@Injectable()
export class CronjobsService {
    private requestQueue: Queue<any> = new Queue();

    constructor(
        private readonly nftTypeService: NftTypesService,
        private readonly blockChainListener: BlockchainEventListenerService,
        private readonly configService: ConfigService,
        private readonly oracleService: OracleConfigsService,
        private readonly web3Service: Web3Service,
        private readonly errorScannerService: ScannerErrorsService,
        private readonly nftHelperService: NftHelperService,
    ) {
        console.log('CronjobsService initialized');
    }

    // Run create NFT from gen and upload to S3 every minute
    @Cron(CronExpression.EVERY_HOUR)
    async createHeroJob() {
        await this.nftHelperService.handleCreateHero();
    }

    // Custom cron expression to run every 5 minutes
    @Cron(CronExpression.EVERY_HOUR)
    async jobMintNFT() {
        await this.nftHelperService.handleMintNfts();
    }

    // Fetch and process past blockchain events every 20 seconds
    @Cron('*/15 * * * * *')
    async getPastEvent() {
        try {
            const config = await this.oracleService.findOneWithCondition({});

            const toBlock = await this.web3Service.getBlockNumber();
            const fromBlock = config.block_number || toBlock - 100000;
            // const fromBlock = 35964342
            await this._processGetPastEvent(fromBlock, toBlock);
            await this.oracleService.update(
                { _id: config._id },
                { block_number: toBlock },
            );
        } catch (error) {
            console.error('Error in getPastEvent', error);
        }
    }


    @Cron(CronExpression.EVERY_30_MINUTES)
    async getErrorPastEvent() {
        try {
            const errors = await this.errorScannerService.find({ status: SCAN_STATUS.ERROR });
            if (!errors.length) return;
            const queue = new Queue<ScannerError>();
            errors.forEach((error) => queue.push(error));
            while (queue.length() > 0) {
                const erScanner = queue.pop();
                if (erScanner) {
                    const fromBlock = erScanner.from_block_number;
                    const toBlock = erScanner.to_block_number;
                    await this._processGetPastEvent(fromBlock, toBlock);
                    await this.errorScannerService.update(
                        { _id: erScanner._id },
                        { status: SCAN_STATUS.SUCCEED },
                    );
                }
            }

        } catch (error) {
            console.log('Error in getPastEvent', error);
        }
    }

    // Fetch past blockchain events
    private async _processGetPastEvent(fromBlock: number, toBlock: number) {
        try {
            console.log(`Fetching events from block ${fromBlock} to ${toBlock}`);
            const nftTypes = await this.nftTypeService.findAllWithCondition({
                status: 'DONE',
                is_active: true,
            });
            const requestListERC721 = nftTypes
                .map((nftType) => nftType.nft_address)
                .filter((erc721Address) => !!erc721Address)
                .map((erc721Address) =>
                    this.blockChainListener.getPastEvents(
                        { address: erc721Address, fromBlock, toBlock },
                        'erc721',
                    ),
                );

            const requestListenMarket = this.blockChainListener.getPastEvents(
                {
                    address: this.configService.get<string>(
                        'MARKET_PLACE_CONTRACT_ADDRESS',
                    ),
                    fromBlock,
                    toBlock,
                },
                'marketplace',
            );

            const requestGame = this.blockChainListener.getPastEvents(
                {
                    address: this.configService.get<string>('GAME_CONTRACT_ADDRESS'),
                    fromBlock,
                    toBlock,
                },
                'game',
            );

            const requestDeposit = this.blockChainListener.getPastEvents(
                {
                    address: this.configService.get<string>('DEPOSIT_CONTRACT_ADDRESS'),
                    fromBlock,
                    toBlock,
                },
                'deposit',
            );

            const requestNFTFactory = this.blockChainListener.getPastEvents(
                {
                    address: this.configService.get<string>('NFT_FACTORY_ADDRESS'),
                    fromBlock,
                    toBlock,
                },
                'nft-factory',
            );
            


            const eventRequests = [
                ...requestListERC721,
                requestListenMarket,
                requestGame,
                requestDeposit,
                requestNFTFactory,
            ];
            console.log('Fetching all events concurrently...');

            const results = await Promise.allSettled(eventRequests);
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Event Request ${index + 1} failed:`, result.reason);
                }
            });
            console.log('Completed fetching past events.');
        } catch (error) {
            await this.errorScannerService.create({
                from_block_number: fromBlock,
                to_block_number: toBlock,
                error_message: error.message.toString(),
            });
            console.error('Critical error in getPastEvent:', error);
        }
    }

}
