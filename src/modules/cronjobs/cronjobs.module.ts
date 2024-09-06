import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { NftsModule } from '../nfts/nfts.module';
import { S3Module } from '../s3/s3.module';
import { RequestModule } from '../mint-request/mint-request.module';
import { NftTypesModule } from '../nft-types/nft-types.module';



@Module({
  imports : [NftsModule, S3Module, RequestModule, NftTypesModule],
  providers: [CronjobsService]
})
export class CronjobsModule {
  
}
