import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { NftsModule } from '../nfts/nfts.module';
import { S3Module } from '../s3/s3.module';
import { NftTypesModule } from '../nft-types/nft-types.module';
import { RequestModule } from '../mint-request/requests.module';
import { BlockchainEventListenerModule } from '../blockchain-event-listener/blockchain-event-listener.module';



@Module({
  imports : [NftsModule, S3Module, RequestModule, NftTypesModule, BlockchainEventListenerModule],
  providers: [CronjobsService]
})
export class CronjobsModule {
  
}
