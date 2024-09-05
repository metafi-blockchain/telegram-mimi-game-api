import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NftsService } from '../nfts/nfts.service';
import { MintRequestService } from '../mint-request/mint-request.service';
import { S3Service } from '../s3/s3.service';
import { STATUS } from '../mint-request/mint-request.entity';
import { getPetObjectInfo } from 'src/utils';
@Injectable()
export class CronjobsService {
    constructor( 
        private readonly nftService : NftsService,
        private readonly mintRequest: MintRequestService,
        private readonly s3Service: S3Service
    ) {
        console.log('CronjobsService initialized');
        
    }
    // RUN create nft from gen and upload to s3 every hour
    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        const mintRequest = await this.mintRequest.findWithCondition({status: STATUS.SUBMITTING});
        if(mintRequest.length == 0) return;
        console.log("=============Start create nft and upload to s3=========");

      for (let i = 0; i < mintRequest.length; i++) {
            const gen = mintRequest[i].gen.toString();
            if(!gen) return;
           const cha = getPetObjectInfo(gen);
           console.log("cha", cha);
           
            //read
          
      }
        
    }

    // Custom cron expression (runs every day at midnight)
    @Cron('0 0 * * *')
    handleDailyTask() {
     console.log('Cron job running every day at midnight');
    }
}
