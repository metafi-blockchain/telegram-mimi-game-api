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
    private requestQueue: Queue<any> = new Queue()

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

    // Run create nft from gen and upload to s3 every minute
    @Cron(CronExpression.EVERY_MINUTE)
    async createHeroJob() {
        try {
            await this._handleCreateHero();
        } catch (error) {
            console.error('Error in createHeroJob:', error);
        }
    }

    // Custom cron expression (runs every 5 minutes)
    @Cron(CronExpression.EVERY_MINUTE)
    async jobMintNFT() {
        try {
            await this._handleMintNfts();
        } catch (error) {
            console.error('Error in jobMintNFT:', error);
        }
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async getPastEvent() {
        try {
            // Fetch the configuration for the starting block
            const config = await this.oracleService.finOneWithCondition({});

            const toBlock = await this.web3Service.getBlockNumber() - 1; // Get the latest block number
            
            const fromBlock = config.block_number || toBlock - 100000; // Use || to safely default to a past block if undefined
            // const fromBlock = 35847797;
            console.log(`===== Fetching events from block ${fromBlock} to ${toBlock} =====`);

            // Fetch all active and done NFT types
            const nftTypes = await this.nftTypeService.findAllWithCondition({
                status: 'DONE',
                is_active: true,
            });

            // Generate promises to fetch ERC721 events for valid addresses
            const requestListERC721 = nftTypes
                .map((nftType) => nftType.nft_address)
                .filter((erc721Address) => !!erc721Address) // Ensure address is valid
                .map((erc721Address) =>
                    this.blockChainListener.getPastEvents({
                        address: erc721Address,
                        fromBlock,
                        toBlock,
                    }, 'erc721'),
                );

            // Fetch marketplace and game events
            const requestListenMarket = this.blockChainListener.getPastEvents({
                address: this.configService.get<string>('MARKET_PLACE_CONTRACT_ADDRESS'),
                fromBlock,
                toBlock,
            }, 'marketplace');

            const requestGame = this.blockChainListener.getPastEvents({
                address: this.configService.get<string>('GAME_CONTRACT_ADDRESS'),
                fromBlock,
                toBlock,
            }, 'game');

            // Execute all event requests concurrently with Promise.allSettled to handle errors individually
            const eventRequests = [
                ...requestListERC721,
                requestListenMarket,
                requestGame,
            ];

            console.log('Fetching all events concurrently...');

            const results = await Promise.allSettled(eventRequests);

            // Log failures
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Request ${index + 1} failed:`, result.reason);
                }
            });

            // Ensure block number is updated only after all events are fetched and processed
            await this.oracleService.update({ _id: config._id }, { block_number: toBlock });

            console.log('============= Completed getPastEvent =============');
        } catch (error) {
            console.error('Critical error in getPastEvent:', error);
        }
    }


    // Handle the minting of NFTs
    public async _handleMintNfts() {
        console.log('============= Start minting NFTs =============');
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

            await Promise.all(requests);
        } catch (error) {
            console.error('Error in handleMintNfts:', error);
        }
    }



    // Handle creation of Hero NFTs and upload to S3
    private async _handleCreateHero() {
        try {
            const path = 'src/templates';
            const mintRequests = await this.mintRequest.findWithCondition({ status: STATUS.SUBMIT });

            if (!mintRequests.length) {
                console.log('No mint requests found');
                return;
            }

            console.log('============= Start queuing mint requests =============');

            const nftType = await this.nftTypeService.finOneWithCondition({ collection_type: COLLECTION_TYPE.HERO, status: TRANSACTION.DONE });
            if (!nftType) {
                console.log('No NFT Type found for HERO collection');
                return;
            }
            // Enqueue all mint requests
            for (const request of mintRequests) {
                this.requestQueue.push(request);
            }

            console.log(`${this.requestQueue.length()} requests enqueued`);

            // Process the queue
            await this.processMintRequests(nftType, path);
            console.log('============= Finished processing NFT mint requests =============');


        } catch (error) {
            console.error('Error in handleCreateHero:', error);
        }
    }

    // Create a file and upload it to S3
    private async createFileAndUploadToS3(basePath: string, gen: string): Promise<string> {
        const filePath = path.join(basePath, `${gen}.json`);
        const heroTemplate = getHeroJsonTemplate(gen);

        try {
            // Ensure directory exists
            if (!fs.existsSync(basePath)) {
                fs.mkdirSync(basePath, { recursive: true });
            }

            fs.writeFileSync(filePath, JSON.stringify(heroTemplate));

            const uri = await this.s3Service.uploadFromPath(filePath);
            fs.unlinkSync(filePath); // Remove the file after uploading to S3
            console.log('File uploaded to S3:', uri);
            return uri;
        } catch (error) {
            console.error('Error creating or uploading file:', error);
            throw error;
        }
    }

    private async processMintRequests(nftType: any, path: string) {
        while (this.requestQueue.length() > 0) {
            const request = this.requestQueue.pop();

            if (request) {
                try {
                    const { gen, reception } = request;

                    // Skip processing if "gen" is missing
                    if (!gen) {
                        console.log(`Skipping request with missing gen: ${request._id}`);
                        continue;
                    }

                    // Create the file and upload it to S3
                    const s3Url = await this.createFileAndUploadToS3(path, gen);

                    // Prepare hero NFT data using the template
                    const heroTemplate = getHeroJsonTemplate(gen);

                    // Create NFT in the database
                    const nft = await this.nftService.createNft({
                        name: heroTemplate.name,
                        gen: gen,
                        uri: s3Url,
                        owner: reception || '',
                        collection_address: nftType.nft_address,
                        attributes: heroTemplate.attributes,
                    });

                    console.log(`NFT created for gen: ${nft.gen} with URI: ${s3Url}`);

                    // Update the mint request status to DONE
                    await this.mintRequest.update({ _id: request._id }, { status: STATUS.DONE });

                } catch (requestError) {
                    console.error(`Error processing request ${request._id}:`, requestError);
                }
            }
        }
    }
}

