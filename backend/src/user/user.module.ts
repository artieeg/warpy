import { AppInviteModule } from '@backend_2/app_invite/app-invite.module';
import { BlockModule } from '@backend_2/block/block.module';
import { CategoryModule } from '@backend_2/categories/categories.module';
import { CoinBalanceModule } from '@backend_2/coin-balance/coin-balance.module';
import { FollowModule } from '@backend_2/follow/follow.module';
import { FriendFeedModule } from '@backend_2/friend_feed/friend_feed.module';
import { StreamModule } from '@backend_2/stream/stream.module';
import { Module } from '@nestjs/common';
import { ParticipantModule } from '../participant/participant.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenModule } from '../token/token.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    PrismaModule,
    CategoryModule,
    FollowModule,
    StreamModule,
    TokenModule,
    FriendFeedModule,
    ParticipantModule,
    BlockModule,
    CoinBalanceModule,
    AppInviteModule,
  ],
  controllers: [UserController],
  providers: [UserEntity, UserService],
  exports: [UserEntity, UserService],
})
export class UserModule {}
