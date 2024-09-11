import { Module } from '@nestjs/common';
import { TransactionHistoryService } from './event-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventLogHistory, EventLogHistorySchema } from './event-history.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: EventLogHistory.name, schema: EventLogHistorySchema}]), 
  ],
  providers: [TransactionHistoryService],
  exports: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
