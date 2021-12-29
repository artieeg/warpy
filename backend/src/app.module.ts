import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppInviteModule } from './app_invite/app-invite.module';
import { AwardModule } from './award/award.module';
import { BlockModule } from './block/block.module';
import { BotsModule } from './bots/bots.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { CategoryModule } from './categories/categories.module';
import { ChatModule } from './chat/chat.module';
import { CoinBalanceModule } from './coin-balance/coin-balance.module';
import { configuration } from './config/configuration';
import { DeveloperAccountModule } from './developer_account/developer_account.module';
import { FeedModule } from './feed/feed.module';
import { FollowModule } from './follow/follow.module';
import { FriendFeedModule } from './friend_feed/friend_feed.module';
import { GifModule } from './gif/gif.module';
import { InviteModule } from './invite/invite.module';
import { MediaModule } from './media/media.module';
import { NatsModule } from './nats/nats.module';
import { NotificationModule } from './notification/notification.module';
import { ParticipantModule } from './participant/participant.module';
import { ReactionModule } from './reaction/reaction.module';
import { StreamBlockModule } from './stream-block/stream-block.module';
import { StreamModule } from './stream/stream.module';
import { TokenModule } from './token/token.module';
import { UserOnlineStatusModule } from './user-online-status/user-online-status.module';
import { UserReportModule } from './user-report/user-report.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CategoryModule,
    CoinBalanceModule,
    AppInviteModule,
    AwardModule,
    BroadcastModule,
    MediaModule,
    DeveloperAccountModule,
    GifModule,
    FeedModule,
    FriendFeedModule,
    UserModule,
    TokenModule,
    UserReportModule,
    StreamModule,
    StreamBlockModule,
    NatsModule,
    ParticipantModule,
    BotsModule,
    BlockModule,
    InviteModule,
    ChatModule,
    ReactionModule,
    FollowModule,
    NotificationModule,
    UserOnlineStatusModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
