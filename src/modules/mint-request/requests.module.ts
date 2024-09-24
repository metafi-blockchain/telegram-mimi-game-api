import { forwardRef, Module } from '@nestjs/common';
import { MintRequestService } from './requests.service';
import { MintRequestController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MintRequest, MintRequestSchema } from './request.entity';
import { ActivityLogsModule } from '../activitylogs/activity-logs.module';
import { NftTypesModule } from '../nft-types/nft-types.module';
import { NftsModule } from '../nfts/nfts.module';
import { ConfigService } from '@nestjs/config';
import { MarketService } from 'src/blockchains/services/market-place.service';
import { OracleConfigsModule } from '../configs/oracle-configs.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name: MintRequest.name, schema: MintRequestSchema}]),
    ActivityLogsModule,
    NftTypesModule,
    forwardRef(() => NftsModule),
    OracleConfigsModule,
    UsersModule

],
  providers: [MintRequestService,
    {
      provide: "RPC_NETWORK",
      useFactory: (configService: ConfigService) => configService.get<string>('WEB3_RPC_URL'),
      inject: [ConfigService],
    },
    {
      provide: "MARKET_PLACE_CONTRACT_ADDRESS",
      useFactory: (configService: ConfigService) => configService.get<string>('MARKET_PLACE_CONTRACT_ADDRESS'),
      inject: [ConfigService],
    },
    {
      provide: MarketService,
      useFactory: (marketContract: string, rpcNetwork: string, ) => new MarketService(marketContract, rpcNetwork),
      inject: [ "MARKET_PLACE_CONTRACT_ADDRESS", "RPC_NETWORK"],
    },

    
  ],
  controllers: [MintRequestController],
  exports: [MintRequestService]
})
export class RequestModule {}
