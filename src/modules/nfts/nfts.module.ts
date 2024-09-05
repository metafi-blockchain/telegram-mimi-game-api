import { Module } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NFT, NFTSchema } from './nft.entity';
import { MultiDelegateCallService } from 'src/blockchains/services/multicall.service';
import { ConfigService } from '@nestjs/config';
import { RequestModule } from '../mint-request/mint-request.module';
import { OracleConfigsModule } from '../configs/oracle-configs.module';
import { NftsController } from './nfts.controller';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    OracleConfigsModule,
    RequestModule,
    MongooseModule.forFeature([{name: NFT.name, schema: NFTSchema}]), 
    TelegramModule
  ],
  providers: [NftsService, MultiDelegateCallService,
    {
      provide: "RPC_NETWORK",
      useFactory: (configService: ConfigService) => configService.get<string>('RPC_URL'),
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
  exports: [NftsService],
  controllers: [NftsController],

})
export class NftsModule {}
