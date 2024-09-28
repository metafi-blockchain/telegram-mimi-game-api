import { User, UserSchema } from './user.entity';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from '@nestjs/config';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports:[MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), TelegramModule],
  providers: [UsersService, ConfigService
    // UsersService,
    // {
    //   provide: APP_INTERCEPTOR, 
    //   useClass: CurrentUserInterceptor 
    // } //config use all app 
  ],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
