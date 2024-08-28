import { Module } from '@nestjs/common';
import { SqsConsumerService } from './sqs-comsumer.service';
import { SqsManagerEventModule } from '../sqs-manager-event/sqs-event.module';

@Module({
  imports:[ SqsManagerEventModule],
  providers: [SqsConsumerService],
  exports: [SqsConsumerService],
})
export class SqsConsumerModule {}
