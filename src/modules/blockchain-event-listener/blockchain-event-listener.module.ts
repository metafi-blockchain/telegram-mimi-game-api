import { Module } from '@nestjs/common';
import { BlockchainEventListenerService } from './blockchain-event-listener.service';
import { NftTypesModule } from '../nft-types/nft-types.module';
import { NftsModule } from '../nfts/nfts.module';

@Module({
  providers: [BlockchainEventListenerService],
  imports: [NftTypesModule, NftsModule],
})
export class BlockchainEventListenerModule {}
