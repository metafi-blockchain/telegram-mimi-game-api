import { MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { JWTAuthModule } from './modules/authentication/jwt.auth.module';
import {ConfigModule , ConfigService} from '@nestjs/config'

import { APP_PIPE } from '@nestjs/core';
import { CustomMiddleware } from './middlewares/custom.middleware';

import { TelegramModule } from './modules/telegram/telegram.module';
import { WeeklyFriendModule } from './modules/weekly-friend/weekly-friend.module';
import { TelegramAuthMiddleware } from './middlewares/telegram-auth.middleware';



// const pathENV = process.env.NODE_ENV === 'production'?'.env':`.env.${process.env.NODE_ENV}`

@Module({
  imports:[
      ConfigModule .forRoot({
          isGlobal: true,
          envFilePath: ".env"
      }),
      UsersModule,
      JWTAuthModule,
      MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: ((config: ConfigService) =>{
            return { uri:  config.get('MONGO_URI_CONNECT_STRING')}
          })
      }),
      TelegramModule,
      WeeklyFriendModule,

    ],
  controllers: [],
  providers:[ ConfigService, {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
          whitelist: true
      })
  }],

})


// export class AppModule {}
// export class AppModule implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//       consumer.apply(CustomMiddleware).forRoutes('*');;
//     }
// }


export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TelegramAuthMiddleware)
      .forRoutes({ path: '/', method: RequestMethod.GET });
  }
}