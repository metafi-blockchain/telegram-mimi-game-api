import { User, UserSchema } from './user.entity';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivityLogsModule } from 'src/modules/activitylogs/activity-logs.module';
import { ConfigService } from '@nestjs/config';
@Module({
  imports:[MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), ActivityLogsModule],
  providers: [UsersService, ConfigService
    // UsersService,
    // {
    //   provide: APP_INTERCEPTOR, 
    //   useClass: CurrentUserInterceptor 
    // } //config use all app 
  ],
  controllers: [UsersController],
  exports: [UsersService, UsersModule]
})
export class UsersModule {}
// export class UsersModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(UserMiddleware).forRoutes({ path: 'user/*', method: RequestMethod.ALL });
//   }
// }
