import { Module } from '@nestjs/common';
import { ActivityLogsModule } from '../activitylogs/activity-logs.module';
import { UsersModule } from '../users/users.module';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
  imports:[UsersModule, ActivityLogsModule],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service]
})
export class S3Module {}
