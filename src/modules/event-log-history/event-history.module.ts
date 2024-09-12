import { Module } from '@nestjs/common';
import { TransactionHistoryService } from './event-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventLogHistory, EventLogHistorySchema } from './event-history.entity';
import { Web3Module } from '../web3/web3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: EventLogHistory.name, schema: EventLogHistorySchema}]), 
    Web3Module,
  ],
  providers: [TransactionHistoryService],
  exports: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
