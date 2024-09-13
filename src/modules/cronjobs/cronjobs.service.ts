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

@Injectable()
export class CronjobsService {
    private requestQueue: Queue<any> = new Queue()

    constructor(
        private readonly nftService: NftsService,
        private readonly mintRequest: MintRequestService,
        private readonly s3Service: S3Service,
        private readonly nftTypeService: NftTypesService,

    ) {
        console.log('CronjobsService initialized');
    }

    // Run create nft from gen and upload to s3 every minute
    @Cron(CronExpression.EVERY_MINUTE)
    async createHeroJob() {
        try {
            await this.handleCreateHero();
        } catch (error) {
            console.error('Error in createHeroJob:', error);
        }
    }

    // Custom cron expression (runs every 5 minutes)
    @Cron(CronExpression.EVERY_5_MINUTES)
    async jobMintNFT() {
        try {
            await this.handleMintNfts();
        } catch (error) {
            console.error('Error in jobMintNFT:', error);
        }
    }

    // Handle the minting of NFTs
    public async handleMintNfts() {
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
    public async handleCreateHero() {
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