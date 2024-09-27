import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { UsersModule } from '../users/users.module';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [UsersModule],
  providers: [TelegramService],
  exports: [TelegramService],
  controllers: [TelegramController]
})
export class TelegramModule {

}
