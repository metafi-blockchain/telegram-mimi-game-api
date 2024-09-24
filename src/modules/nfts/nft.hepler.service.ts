import * as fs from 'fs/promises';
import * as path from 'path';
import { getHeroJsonTemplate } from "src/utils";
import { S3Service } from "../s3/s3.service";
import { NftTypesService } from '../nft-types/nft-types.service';
import { COLLECTION_TYPE, TRANSACTION } from '../nft-types/nft-types.entity';
import { MINT_STATUS } from './nft.entity';
import { NftsService } from './nfts.service';
import { STATUS } from '../mint-request/request.entity';
import { MintRequestService } from '../mint-request/requests.service';
import { Queue } from 'src/blockchains/utils';
import { CreateNftDto } from './dtos/nft.dto';
import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class NftHelperService {
    private readonly logger = new Logger(NftHelperService.name);

    private requestQueue: Queue<any> = new Queue();

    constructor(
        private readonly s3Service: S3Service,
        private readonly nftTypeService: NftTypesService,
        private readonly nftService: NftsService,
        private readonly mintRequest: MintRequestService,
    ) {}

    // Asynchronously create and upload the hero file to S3


    // Mint NFTs from NFT types in DONE status
    async handleMintNfts(): Promise<void> {
        try {
            const nftTypes = await this.nftTypeService.findAllWithCondition({
                status: TRANSACTION.DONE,
            });

            if (!nftTypes.length) {
                console.log('No NFT types found for minting');
                return;
            }

            const mintRequests = nftTypes.map(nftType => this.processNftTypeMint(nftType));
            await Promise.all(mintRequests);
        } catch (error) {
            console.error('Error in handleMintNfts:', error);
        }
    }

    // Process NFT type mint
    private async processNftTypeMint(nftType: any): Promise<void> {
        const collection = nftType.nft_address;
        const nftRequest = await this.nftService.getNftsByMintStatus(MINT_STATUS.INITIALIZE, collection);

        if (nftRequest.length > 0) {
            await this.nftService.mintBatchNFT(collection, nftRequest);
        }
    }

    // Handle creating hero NFTs and upload them to S3
    async handleCreateHero(): Promise<void> {

        try {

            const templatePath = 'src/templates';
            const mintRequests = await this.mintRequest.findWithCondition({ status: STATUS.SUBMIT,});

            if (!mintRequests.length) return;
            
            console.log('Queuing mint requests...');
            const nftType = await this.nftTypeService.findOneWithCondition({
                collection_type: COLLECTION_TYPE.HERO,
                status: TRANSACTION.DONE,
            });

            if (!nftType) {
                console.log('No NFT Type found for HERO collection');
                return;
            }

            mintRequests.forEach(request => this.requestQueue.push(request));

            console.log(`${this.requestQueue.length()} requests enqueued`);

            await this.processMintRequests(nftType, templatePath);

        } catch (error) {
            this.logger.error('Error in handleCreateHero:', error);
            console.error('Error in handleCreateHero:', error);
        }
    }

    // Process each mint request from the queue
     async processMintRequests(nftType: any, templatePath: string): Promise<void> {
       
        while (this.requestQueue.length() > 0) {

            const request = this.requestQueue.pop();
            if (!request) continue;

            const { gen, reception } = request;

            if (!gen) {
                console.log(`Skipping request with missing gen: ${request._id}`);
                continue;
            }

            try {
                const s3Url = await this._createFileAndUploadToS3(templatePath, gen);
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
                    gen,
                    uri: s3Url,
                    owner: reception || '',
                    collection_address: nftType.nft_address,
                    attributes: heroTemplate.attributes,
                    chain_id: nftType.chain_id,
                } as CreateNftDto);

                console.log(`NFT created for gen: ${nft.gen} with URI: ${s3Url}`);
                await this.mintRequest.update({ _id: request._id }, { status: STATUS.DONE });
            } catch (requestError) {
                console.error(`Error processing request ${request._id}:`, requestError);
            }
        }
    }


    private async _createFileAndUploadToS3(basePath: string, gen: string): Promise<string | void> {
        const filePath = path.join(basePath, `${gen}.json`);
        const heroTemplate = getHeroJsonTemplate(gen);

        if (!heroTemplate) return;

        try {
            await fs.mkdir(basePath, { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(heroTemplate));

            const uri = await this.s3Service.uploadFromPath(filePath);
            await fs.unlink(filePath);

            console.log('File uploaded to S3:', uri);
            return uri;
        } catch (error) {
            console.error('Error creating or uploading file:', error);
            throw new Error('Failed to create or upload file');
        }
    }
}