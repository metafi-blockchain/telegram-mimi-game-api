import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivityLog, ActivityLogSchema } from './activity-log.entity';
import { ActivitylogsService } from './activitylogs.service';

@Module({
    imports:[MongooseModule.forFeature([{name: ActivityLog.name, schema: ActivityLogSchema}])],
  providers: [ActivitylogsService],
  exports: [ActivitylogsService],
})
export class ActivityLogsModule {}
