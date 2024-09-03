import { Module } from '@nestjs/common';
import { NftTypesService } from './nft-types.service';
import { NftTypesController } from './nft-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLogsModule } from 'src/modules/activitylogs/activity-logs.module';
import { NftType, NftTypeSchema } from './nft-types.entity';
import {NFTFactoryService} from '../../blockchains/services/index'
import { ConfigService } from '@nestjs/config';
import { OracleConfigsModule } from '../configs/oracle-configs.module';
import { OracleConfigsService } from '../configs/oracle-configs.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name: NftType.name, schema: NftTypeSchema}]), 
    ActivityLogsModule, 
    OracleConfigsModule,
  ],

  providers: [NftTypesService, NFTFactoryService,
    {
      provide: "RPC_NETWORK",
      useFactory: (configService: ConfigService) => configService.get<string>('RPC_URL'),
      inject: [ConfigService],
    },
    {
      provide: "FACTORY_ADDRESS",
      useFactory: (configService: ConfigService) => configService.get<string>('NFT_FACTORY_ADDRESS'),
      inject: [ConfigService],
    },
    {
      provide: NFTFactoryService,
      useFactory: (factoryAddress: string, rpcNetwork: string, ) => new NFTFactoryService(factoryAddress, rpcNetwork),
      inject: [ "FACTORY_ADDRESS", "RPC_NETWORK"],
    },

  ],
  controllers: [NftTypesController],
  exports: [NftTypesService]
})
export class NftTypesModule {}
