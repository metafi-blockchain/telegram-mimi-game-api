import { Module } from '@nestjs/common';
import { MintRequestService } from './mint-request.service';
import { MintRequestController } from './mint-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MintRequest, MintRequestSchema } from './mint-request.entity';
import { ActivityLogsModule } from '../activitylogs/activity-logs.module';

@Module({
  imports:[MongooseModule.forFeature([{name: MintRequest.name, schema: MintRequestSchema}]), ActivityLogsModule],
  providers: [MintRequestService],
  controllers: [MintRequestController]
})
export class RequestModule {}
