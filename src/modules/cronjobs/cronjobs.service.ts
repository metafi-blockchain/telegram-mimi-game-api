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
        private readonly web3Service: Web3Service
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

    // Fetch and process past blockchain events every 15 seconds
    @Cron("*/15 * * * * *")
    async getPastEvent() {
        try {
            const config = await this.oracleService.finOneWithCondition({});

            const toBlock = await this.web3Service.getBlockNumber() - 1;
            const fromBlock = config.block_number || toBlock - 100000;

            console.log(`Fetching events from block ${fromBlock} to ${toBlock}`);

            const nftTypes = await this.nftTypeService.findAllWithCondition({ status: 'DONE', is_active: true });
            const requestListERC721 = nftTypes
                .map((nftType) => nftType.nft_address)
                .filter((erc721Address) => !!erc721Address)
                .map((erc721Address) =>
                    this.blockChainListener.getPastEvents({ address: erc721Address, fromBlock, toBlock }, 'erc721')
                );

            const requestListenMarket = this.blockChainListener.getPastEvents(
                { address: this.configService.get<string>('MARKET_PLACE_CONTRACT_ADDRESS'), fromBlock, toBlock },
                'marketplace'
            );

            const requestGame = this.blockChainListener.getPastEvents(
                { address: this.configService.get<string>('GAME_CONTRACT_ADDRESS'), fromBlock, toBlock },
                'game'
            );

            const eventRequests = [...requestListERC721, requestListenMarket, requestGame];
            console.log('Fetching all events concurrently...');

            const results = await Promise.allSettled(eventRequests);
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Event Request ${index + 1} failed:`, result.reason);
                }
            });

            await this.oracleService.update({ _id: config._id }, { block_number: toBlock });
            console.log('Completed fetching past events.');
        } catch (error) {
            console.error('Critical error in getPastEvent:', error);
        }
    }

    // Mint NFTs and handle errors
    private async _handleMintNfts() {
        try {
            const nftTypes = await this.nftTypeService.findAllWithCondition({ status: TRANSACTION.DONE });
            if (!nftTypes.length) {
                console.log('No NFT types found for minting');
                return;
            }

            const requests = nftTypes.map(async (nftType) => {
                const collection = nftType.nft_address;
                const nftRequest = await this.nftService.getNftsByMintStatus(MINT_STATUS.INITIALIZE, collection);
                if (nftRequest.length > 0) {
                    return this.nftService.mintBatchNFT(collection, nftRequest);
                }
            });

            if (!requests.length) {
                console.log('No NFTs found for minting');
                return;
            }

            console.log('Start minting NFTs...');
            await Promise.all(requests);
            console.log('Finished minting NFTs');
        } catch (error) {
            console.error('Error in handleMintNfts:', error);
        }
    }

    // Create Hero NFTs and upload to S3
    private async _handleCreateHero() {
        try {
            const path = 'src/templates';
            const mintRequests = await this.mintRequest.findWithCondition({ status: STATUS.SUBMIT });
            if (!mintRequests.length) {
                console.log('No mint requests found');
                return;
            }

            console.log('Queuing mint requests...');
            const nftType = await this.nftTypeService.finOneWithCondition({ collection_type: COLLECTION_TYPE.HERO, status: TRANSACTION.DONE });
            if (!nftType) {
                console.log('No NFT Type found for HERO collection');
                return;
            }

            mintRequests.forEach(request => this.requestQueue.push(request));
            console.log(`${this.requestQueue.length()} requests enqueued`);

            await this._processMintRequests(nftType, path);
            console.log('Finished processing NFT mint requests');
        } catch (error) {
            console.error('Error in handleCreateHero:', error);
        }
    }

    // Create and upload file to S3
    private async _createFileAndUploadToS3(basePath: string, gen: string): Promise<string> {
        const filePath = path.join(basePath, `${gen}.json`);
        const heroTemplate = getHeroJsonTemplate(gen);

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
                    const heroTemplate = getHeroJsonTemplate(gen);

                    const nft = await this.nftService.createNft({
                        name: heroTemplate.name,
                        gen: gen,
                        uri: s3Url,
                        owner: reception || '',
                        collection_address: nftType.nft_address,
                        attributes: heroTemplate.attributes,
                    });

                    console.log(`NFT created for gen: ${nft.gen} with URI: ${s3Url}`);
                    await this.mintRequest.update({ _id: request._id }, { status: STATUS.DONE });

                } catch (requestError) {
                    console.error(`Error processing request ${request._id}:`, requestError);
                }
            }
        }
    }
}