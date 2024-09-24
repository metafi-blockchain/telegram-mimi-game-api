import { forwardRef, Module } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NFT, NFTSchema } from './nft.entity';
import { MultiDelegateCallService } from 'src/blockchains/services/multicall.service';
import { ConfigService } from '@nestjs/config';
import { OracleConfigsModule } from '../configs/oracle-configs.module';
import { NftsController } from './nfts.controller';
import { TelegramModule } from '../telegram/telegram.module';
import { S3Module } from '../s3/s3.module';
import { NftHelperService } from './nft.hepler.service';
import { NftTypesModule } from '../nft-types/nft-types.module';
import { RequestModule } from '../mint-request/requests.module';

@Module({
  imports: [
    OracleConfigsModule,
    MongooseModule.forFeature([{name: NFT.name, schema: NFTSchema}]), 
    forwardRef(() => RequestModule),
    S3Module,
   NftTypesModule, 
    RequestModule 
  ],
  providers: [NftsService, MultiDelegateCallService, NftHelperService,
    {
      provide: "RPC_NETWORK",
      useFactory: (configService: ConfigService) => configService.get<string>('WEB3_RPC_URL'),
      inject: [ConfigService],
    },
    {
      provide: "MULTI_CALL_ADDRESS",
      useFactory: (configService: ConfigService) => configService.get<string>('MULTI_DELEGATE_CALL_ADDRESS'),
      inject: [ConfigService],
    },
    {
      provide: MultiDelegateCallService,
      useFactory: (multiCallAddress: string, rpcNetwork: string, ) => new MultiDelegateCallService(multiCallAddress, rpcNetwork),
      inject: [ "MULTI_CALL_ADDRESS", "RPC_NETWORK"],
    },

  ],
  exports: [NftsService, NftHelperService],
  controllers: [NftsController],

})
export class NftsModule {}
