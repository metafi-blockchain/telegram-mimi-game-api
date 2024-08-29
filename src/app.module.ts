import { MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { JWTAuthModule } from './modules/authentication/jwt.auth.module';
import { ActivityLogsModule } from './modules/activitylogs/activity-logs.module';
import {ConfigModule , ConfigService} from '@nestjs/config'
import { S3Module } from './modules/s3/s3.module';

import { APP_PIPE } from '@nestjs/core';
import { SqsConsumerModule } from './modules/sqs-consumer/sqs-consumer.module';
import { SqsManagerEventModule } from './modules/sqs-manager-event/sqs-event.module';
import { CustomMiddleware } from './custom.middleware';
import { TransactionModule } from './modules/transaction/transaction.module';
import { NftCategoriesModule } from './modules/nft-categories/nft-categories.module';
import { NftsModule } from './modules/nfts/nfts.module';
import { CronjobsModule } from './modules/cronjobs/cronjobs.module';
import { RequestModule } from './modules/request/request.module';



const pathENV = process.env.NODE_ENV === 'production'?'.env':`.env.${process.env.NODE_ENV}`

@Module({
  imports:[
      ConfigModule .forRoot({
          isGlobal: true,
          envFilePath: pathENV
      }),
      UsersModule,
      JWTAuthModule,
      MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: ((config: ConfigService) =>{
            return {
              uri:  config.get('MONGO_URI_CONNECT_STRING'), // Use the MongooseConfigService to get the URI
              useNewUrlParser: true,
              useUnifiedTopology: true,
            }
          })
      }),
      // MongooseModule .forRoot('mongodb+srv://dev:pQkZzHzuIfV0u1sP@cluster0.xyhwi3x.mongodb.net/db-dev'),
      ActivityLogsModule,

      S3Module,

      SqsConsumerModule,
      SqsManagerEventModule,
      TransactionModule,
      NftCategoriesModule,
      NftsModule,
      CronjobsModule,
      RequestModule,
  
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
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(CustomMiddleware).forRoutes('*');;
    }
}
