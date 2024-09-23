import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NftsService } from '../nfts/nfts.service';
import { MintRequestService } from '../mint-request/requests.service';
import { S3Service } from '../s3/s3.service';
import { STATUS } from '../mint-request/request.entity';
import * as fs from 'fs';
import * as path from 'path';
import { getHeroJsonTemplate } from 'src/utils/getHeroJson';
import { NftTypesService } from '../nft-types/nft-types.service';
import { COLLECTION_TYPE, TRANSACTION } from '../nft-types/nft-types.entity';
import { MINT_STATUS } from '../nfts/nft.entity';
import { Queue } from 'src/blockchains/utils';
import { BlockchainEventListenerService } from '../blockchain-event-listener/blockchain-event-listener.service';
import { ConfigService } from '@nestjs/config';
import { OracleConfigsService } from '../configs/oracle-configs.service';
import { Web3Service } from '../web3/web3.service';
import { ScannerErrorsService } from '../scanner-errors/scanner-errors.service';
import { SCAN_STATUS, ScannerError } from '../scanner-errors/scanner-error.entity';
import { CreateNftDto } from '../nfts/dtos/nft.dto';

@Injectable()
export class CronjobsService {
    private requestQueue: Queue<any> = new Queue();

    constructor(
        private readonly nftService: NftsService,
        private readonly mintRequest: MintRequestService,
        private readonly s3Service: S3Service,
        private readonly nftTypeService: NftTypesService,
        private readonly blockChainListener: BlockchainEventListenerService,
        private readonly configService: ConfigService,
        private readonly oracleService: OracleConfigsService,
        private readonly web3Service: Web3Service,
        private readonly errorScannerService: ScannerErrorsService,
    ) {
        console.log('CronjobsService initialized');
    }

    // Run create NFT from gen and upload to S3 every minute
    @Cron(CronExpression.EVERY_5_MINUTES)
    async createHeroJob() {
        await this._handleCreateHero();
    }

    // Custom cron expression to run every 5 minutes
    @Cron(CronExpression.EVERY_5_MINUTES)
    async jobMintNFT() {
        await this._handleMintNfts();
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

    // Mint NFTs and handle errors
    private async _handleMintNfts() {
        try {
            const nftTypes = await this.nftTypeService.findAllWithCondition({
                status: TRANSACTION.DONE,
            });
            if (!nftTypes.length) {
                console.log('No NFT types found for minting');
                return;
            }

            const requests = nftTypes.map(async (nftType) => {
                const collection = nftType.nft_address;
                const nftRequest = await this.nftService.getNftsByMintStatus(
                    MINT_STATUS.INITIALIZE,
                    collection,
                );
                if (nftRequest.length > 0) {
                    return this.nftService.mintBatchNFT(collection, nftRequest);
                }
            });
            await Promise.all(requests);
        } catch (error) {
            console.error('Error in handleMintNfts:', error);
        }
    }

    // Create Hero NFTs and upload to S3
    private async _handleCreateHero() {
        try {
            const path = 'src/templates';
            const mintRequests = await this.mintRequest.findWithCondition({
                status: STATUS.SUBMIT,
            });
            if (!mintRequests.length) {
                console.log('No mint requests found');
                return;
            }

            console.log('Queuing mint requests...');
            const nftType = await this.nftTypeService.findOneWithCondition({
                collection_type: COLLECTION_TYPE.HERO,
                status: TRANSACTION.DONE,
            });
            
            if (!nftType) {
                console.log('No NFT Type found for HERO collection');
                return;
            }

            mintRequests.forEach((request) => this.requestQueue.push(request));
            console.log(`${this.requestQueue.length()} requests enqueued`);

            await this._processMintRequests(nftType, path);

        } catch (error) {
            console.error('Error in handleCreateHero:', error);
        }
    }

    // Create and upload file to S3
    private async _createFileAndUploadToS3(
        basePath: string,
        gen: string,
    ): Promise<string> {
        const filePath = path.join(basePath, `${gen}.json`);
        const heroTemplate = getHeroJsonTemplate(gen);
        
        if(!heroTemplate)  return ;
        

        try {
            if (!fs.existsSync(basePath)) {
                fs.mkdirSync(basePath, { recursive: true });
            }

            fs.writeFileSync(filePath, JSON.stringify(heroTemplate));
            const uri = await this.s3Service.uploadFromPath(filePath);
            fs.unlinkSync(filePath);
            console.log('File uploaded to S3:', uri);
            return uri;
        } catch (error) {
            console.error('Error creating or uploading file:', error);
            throw error;
        }
    }

    // Process mint requests from the queue
    private async _processMintRequests(nftType: any, path: string) {
        while (this.requestQueue.length() > 0) {
            const request = this.requestQueue.pop();

            if (request) {
                try {
                    const { gen, reception } = request;
                    if (!gen) {
                        console.log(`Skipping request with missing gen: ${request._id}`);
                        continue;
                    }

                    const s3Url = await this._createFileAndUploadToS3(path, gen);

                    if (!s3Url) {
                        console.log(`Skipping request with missing S3 URL: ${request._id}`);
                        continue;
                    }

                    const heroTemplate = getHeroJsonTemplate(gen);
                    if (!heroTemplate) {
                        console.log(`Skipping request with missing hero template: ${request._id}`);
                        continue;
                    }

                    const nft = await this.nftService.createNft({
                        name: heroTemplate.name,
                        gen: gen,
                        uri: s3Url,
                        owner: reception || '',
                        collection_address: nftType.nft_address,
                        attributes: heroTemplate.attributes,
                        chain_id: nftType.chain_id,
                    } as CreateNftDto);

                    console.log(`NFT created for gen: ${nft.gen} with URI: ${s3Url}`);
                    await this.mintRequest.update(
                        { _id: request._id },
                        { status: STATUS.DONE },
                    );
                } catch (requestError) {
                    console.error(
                        `Error processing request ${request._id}:`,
                        requestError,
                    );
                }
            }
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
