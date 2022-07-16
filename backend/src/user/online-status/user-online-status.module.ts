import { Module } from '@nestjs/common';
import { NjsUserOnlineStatusCache } from './user-online-status.cache';
import { UserOnlineStatusService } from './user-online-status.service';

@Module({
  imports: [],
  providers: [NjsUserOnlineStatusCache, UserOnlineStatusService],
  controllers: [],
  exports: [UserOnlineStatusService],
})
export class UserOnlineStatusModule {}
