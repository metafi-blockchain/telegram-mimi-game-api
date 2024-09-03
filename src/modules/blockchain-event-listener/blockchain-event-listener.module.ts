import { Module } from '@nestjs/common';
import { BlockchainEventListenerService } from './blockchain-event-listener.service';
import { NftTypesModule } from '../nft-types/nft-types.module';

@Module({
  providers: [BlockchainEventListenerService],
  imports: [NftTypesModule],
})
export class BlockchainEventListenerModule {}
