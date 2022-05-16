import { Module } from '@nestjs/common';
import { BlockModule } from '@warpy-be/block/block.module';
import { FollowModule } from '@warpy-be/follow/follow.module';
import { UserListController } from './user-list.controller';
import { UserListService } from './user-list.service';

@Module({
  imports: [BlockModule, FollowModule],
  providers: [UserListService],
  controllers: [UserListController],
  exports: [UserListService],
})
export class UserListModule {}
