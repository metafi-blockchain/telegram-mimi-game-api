import { Module } from '@nestjs/common';
import { BlockchainEventListenerService } from './blockchain-event-listener.service';

@Module({
  providers: [BlockchainEventListenerService]
})
export class BlockchainEventListenerModule {}
