import { StreamModule } from '@backend_2/stream/stream.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenModule } from '../token/token.module';
import { AppInviteModule } from './app_invite/app-invite.module';
import { BlockModule } from './block/block.module';
import { CoinBalanceModule } from './coin-balance/coin-balance.module';
import { DeveloperAccountModule } from './developer_account/developer_account.module';
import { FollowModule } from './follow/follow.module';
import { FriendFeedModule } from './friend_feed/friend_feed.module';
import { UserOnlineStatusModule } from './online-status/user-online-status.module';
import { ParticipantModule } from './participant/participant.module';
import { UserReportModule } from './report/user-report.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    PrismaModule,
    FollowModule,
    StreamModule,
    TokenModule,
    FriendFeedModule,
    ParticipantModule,
    BlockModule,
    UserOnlineStatusModule,
    UserReportModule,
    CoinBalanceModule,
    AppInviteModule,
    DeveloperAccountModule,
  ],
  controllers: [UserController],
  providers: [UserEntity, UserService],
  exports: [
    UserEntity,
    UserService,
    BlockModule,
    ParticipantModule,
    FollowModule,
    CoinBalanceModule,
    DeveloperAccountModule,
  ],
})
export class UserModule {}
