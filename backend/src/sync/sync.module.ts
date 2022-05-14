import { Module } from '@nestjs/common';
import { FriendFeedModule } from '@warpy-be/friend_feed/friend_feed.module';
import { CategoryModule } from '@warpy-be/stream/categories/categories.module';
import { AppInviteModule } from '@warpy-be/user/app_invite/app-invite.module';
import { UserModule } from '@warpy-be/user/user.module';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [UserModule, AppInviteModule, CategoryModule, FriendFeedModule],
  providers: [SyncService],
  controllers: [SyncController],
  exports: [],
})
export class SyncModule {}
