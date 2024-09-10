import { Module } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';

@Module({
  providers: [TransactionHistoryService]
})
export class TransactionHistoryModule {}
