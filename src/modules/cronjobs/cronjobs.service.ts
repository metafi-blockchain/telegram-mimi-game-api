import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NftsService } from '../nfts/nfts.service';
import { MintRequestService } from '../mint-request/requests.service';
import { S3Service } from '../s3/s3.service';
import { STATUS } from '../mint-request/request.entity';
import * as fs from 'fs';
import { getHeroJsonTemplate } from 'src/utils/getHeroJson';
import { NftTypesService } from '../nft-types/nft-types.service';
import { COLLECTION_TYPE, TRANSACTION } from '../nft-types/nft-types.entity';
import { MINT_STATUS } from '../nfts/nft.entity';
@Injectable()
export class CronjobsService {
    constructor(
        private readonly nftService: NftsService,
        private readonly mintRequest: MintRequestService,
        private readonly s3Service: S3Service,
        private readonly nftTypeService: NftTypesService,
    ) {
        console.log('CronjobsService initialized');

    }
    // RUN create nft from gen and upload to s3 every hour
    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleCreateHeroCron() {
        let path = 'src/templates';
        const mintRequest = await this.mintRequest.findWithCondition({ status: STATUS.SUBMITTING });

        if (!mintRequest.length) return;
        console.log("=============Start create nft and upload to s3=========");

        const nftType = await this.nftTypeService.finOneWithCondition({ collection_type: COLLECTION_TYPE.HERO, status: TRANSACTION.DONE });

        if (!nftType) return;

        for (let i = 0; i < mintRequest.length; i++) {
            const request = mintRequest[i];
            const gen = request.gen;
            if (!gen) return;
            const heroTemplate = getHeroJsonTemplate(gen);
            const s3Url = await this.createFileAndUploadToS3(path, gen);

            //create on database
            await this.nftService.createNft({
                name: heroTemplate.name,
                gen: gen,
                uri: s3Url,
                owner: request.reception ? request.reception : '',
                collection_address: nftType.nft_address,
            }).then(async (nft) => {    
                console.log('nft create: ', nft.gen);
                await this.mintRequest.update({_id: request._id }, { status: STATUS.DONE });
            });
        }

    }

    // Custom cron expression (runs every day at midnight)
    @Cron(CronExpression.EVERY_HOUR)
    async handleMintNft() {
        console.log("=============Start create mint =========");
        const nftTypes = await this.nftTypeService.findAllWithCondition({  status: TRANSACTION.DONE });
        const requests = [];
        for (let i = 0; i < nftTypes.length; i++) {

            const collection = nftTypes[i].nft_address;
            const nftRequest = await this.nftService.getNftsByMintStatus(MINT_STATUS.INITIALIZE, collection);
            const request =  this.nftService.mintBatchNFT(collection, nftRequest)  
            requests.push(request);
        }
        await Promise.all(requests);
        // const nftRequest = await this.nftService.getNftsByMintStatus(MINT_STATUS.INITIALIZE);
    }



    async createFileAndUploadToS3(path: string, gen: string): Promise<string> {
        if (!path) return;
        const filePath = `${path}/${gen}.json`; // File path
        const heroTemplate = getHeroJsonTemplate(gen);
        fs.writeFileSync(filePath, JSON.stringify(heroTemplate));

        const uri = await this.s3Service.uploadFromPath(`${path}/${gen}.json`)
        fs.unlinkSync(filePath);
        console.log('File uploaded to s3:', uri)
        return uri;
    }
}
