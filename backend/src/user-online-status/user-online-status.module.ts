import { Module } from '@nestjs/common';
import { UserOnlineStatusCache } from './user-online-status.cache';
import { UserOnlineStatusService } from './user-online-status.service';

@Module({
  imports: [],
  providers: [UserOnlineStatusCache, UserOnlineStatusService],
  controllers: [],
  exports: [UserOnlineStatusService],
})
export class UserOnlineStatusModule {}
