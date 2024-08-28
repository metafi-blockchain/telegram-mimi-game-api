import { Module } from '@nestjs/common';
import { SqsManagerEventService } from './sqs.event.service';
import { EventTypeService } from './event.strategy.pattern';

@Module({
  imports:[],
  providers: [SqsManagerEventService, EventTypeService],
  exports:[SqsManagerEventService]
})
export class SqsManagerEventModule {
  
}
