import { Module } from '@nestjs/common';
import { WeeklyFriendService } from './weekly-friend.service';

@Module({
  providers: [WeeklyFriendService]
})
export class WeeklyFriendModule {}
