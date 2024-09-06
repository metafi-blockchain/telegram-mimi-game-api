import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { NftsModule } from '../nfts/nfts.module';
import { S3Module } from '../s3/s3.module';
import { RequestModule } from '../mint-request/mint-request.module';



@Module({
  imports : [NftsModule, S3Module, RequestModule, ],
  providers: [CronjobsService]
})
export class CronjobsModule {
  
}
