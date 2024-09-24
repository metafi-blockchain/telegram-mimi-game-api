import { Module } from '@nestjs/common';
import { BlockchainEventListenerService } from './blockchain-event-listener.service';
import { NftTypesModule } from '../nft-types/nft-types.module';
import { NftsModule } from '../nfts/nfts.module';
import { TransactionHistoryModule } from '../event-log-history/event-history.module';
import { Web3Module } from '../web3/web3.module';
import { AxiosHelperService } from './axios-helper.service';
import { DepositRequestModule } from '../deposit-request/deposit-request.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  providers: [BlockchainEventListenerService, AxiosHelperService],
  imports: [NftTypesModule, NftsModule, TransactionHistoryModule, Web3Module, DepositRequestModule, TelegramModule],
  exports: [BlockchainEventListenerService],
})
export class BlockchainEventListenerModule {}
