import { Module } from '@nestjs/common';
import { BlockchainEventListenerService } from './blockchain-event-listener.service';
import { NftTypesModule } from '../nft-types/nft-types.module';
import { NftsModule } from '../nfts/nfts.module';
import { Transaction } from 'ethers';
import { TransactionHistoryModule } from '../event-log-history/event-history.module';

@Module({
  providers: [BlockchainEventListenerService],
  imports: [NftTypesModule, NftsModule, TransactionHistoryModule],
})
export class BlockchainEventListenerModule {}
