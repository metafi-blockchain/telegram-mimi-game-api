import { Module } from '@nestjs/common';
import { OracleConfigsService } from './oracle-configs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OracleConfig, OracleConfigSchema } from './oracle-config.entity';
import { ActivityLogsModule } from '../activitylogs/activity-logs.module';
import { ConfigService } from '@nestjs/config';


@Module({
  imports:[MongooseModule.forFeature([{name: OracleConfig.name, schema: OracleConfigSchema}])],
  providers: [OracleConfigsService, ConfigService],
  exports: [OracleConfigsService]
})
export class OracleConfigsModule {}
