import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  SQSClient,
  Message,
} from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { Consumer } from 'sqs-consumer';

import { SqsManagerEventService } from '../sqs-manager-event/sqs.event.service';

@Injectable()
export class SqsConsumerService implements OnModuleInit  {
  private _consumer: Consumer;

  constructor(private readonly configService: ConfigService, 
    private sqsManagerEventService: SqsManagerEventService) {
    this._consumer = Consumer.create({
      queueUrl: configService.get<string>('SQL_QUEUE_URL'),
      handleMessage: this.handleMessage.bind(this),
      sqs: new SQSClient({
        region: configService.get<string>('AWS_REGION'),
        credentials: {
          accessKeyId: configService.get<string>('SQS_AWS_ACCESS_KEY'),
          secretAccessKey: configService.get<string>('SQS_AWS_SECRET_KEY'),
        },
      }),
    });
   
  }
    //when module finished init,this function will run
  onModuleInit(): void {
    // console.log(this.sqsManagerEventService);
    
    
    this.startSqsConsumer();
    this.sqsManagerEventService.startJob()
    
  }

  private async handleMessage(message: Message): Promise<void> {
    // Handle the received message here
    try {
        if (!message) return;
  
        const data = JSON.parse(message.Body) as IEventSQSQueue;
        console.info('Received message:', data)

        const { event } = data;

        const _eventManager =  this.sqsManagerEventService.getTopicManager();
  
         const _eventHandle = _eventManager.getEvent(event);
  
        if (!_eventHandle) throw 'Event Not Found!';
  
      //   //handle event
    
        _eventHandle.processEvent(data.data);
        
      } catch (error) {
        console.error(error);
        throw 'Error process queue';
      }
  }
  
  startSqsConsumer(): void {
    this._consumer.start();
    console.log(
      'Consumer init: ',
      this.configService.get<string>('SQL_QUEUE_URL'),
    );
    this._consumer.on('error', (err) => {
        console.error(err.message);
      });
  
      this._consumer.on('processing_error', (err) => {
        console.error(err.message);
        this._consumer.start()
      });
  
      this._consumer.on('timeout_error', (err) => {
        console.error(err.message);
      });
  }

  stopConsumer(): void {
    this._consumer.stop();
  }
}