import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { NftsModule } from '../nfts/nfts.module';
import { S3Module } from '../s3/s3.module';
import { NftTypesModule } from '../nft-types/nft-types.module';
import { RequestModule } from '../mint-request/requests.module';
import { BlockchainEventListenerModule } from '../blockchain-event-listener/blockchain-event-listener.module';
import { OracleConfigsModule } from '../configs/oracle-configs.module';
import { Web3Module } from '../web3/web3.module';
import { ScannerErrorsModule } from '../scanner-errors/scanner-errors.module';



@Module({
  imports: [NftsModule, S3Module, RequestModule, NftTypesModule, 
    BlockchainEventListenerModule, OracleConfigsModule,
    Web3Module,
    ScannerErrorsModule
  ],
  providers: [CronjobsService]
})
export class CronjobsModule {

}
