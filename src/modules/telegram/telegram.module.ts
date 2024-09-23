import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { UsersModule } from '../users/users.module';
import { NftsModule } from '../nfts/nfts.module';
import { Web3Module } from '../web3/web3.module';
import { NftTypesModule } from '../nft-types/nft-types.module';

@Module({
  imports: [UsersModule, Web3Module, NftTypesModule, forwardRef(() => NftsModule)],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {

}
