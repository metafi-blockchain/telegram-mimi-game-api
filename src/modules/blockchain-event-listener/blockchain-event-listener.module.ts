import { Module } from '@nestjs/common';
import { BlockchainEventListenerService } from './blockchain-event-listener.service';
import { NftTypesModule } from '../nft-types/nft-types.module';
import { NftsModule } from '../nfts/nfts.module';
import { Transaction } from 'ethers';
import { TransactionHistoryModule } from '../event-log-history/event-history.module';
import { Web3Module } from '../web3/web3.module';
import { AxiosHelperService } from './axios-helper.service';

@Module({
  providers: [BlockchainEventListenerService, AxiosHelperService],
  imports: [NftTypesModule, NftsModule, TransactionHistoryModule, Web3Module],
  exports: [BlockchainEventListenerService],
})
export class BlockchainEventListenerModule {}
