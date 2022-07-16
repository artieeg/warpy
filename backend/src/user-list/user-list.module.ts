import { Module } from '@nestjs/common';
import { BlockModule } from '@warpy-be/block/block.module';
import { FollowModule } from '@warpy-be/follow/follow.module';
import { UserListController } from './user-list.controller';
import { NjsUserListService } from './user-list.service';

@Module({
  imports: [BlockModule, FollowModule],
  providers: [NjsUserListService],
  controllers: [UserListController],
  exports: [NjsUserListService],
})
export class UserListModule {}
