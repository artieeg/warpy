import { AppInviteModule } from '@warpy-be/app_invite/app-invite.module';
import { AwardModule } from '@warpy-be/award/award.module';
import { BlockModule } from '@warpy-be/block/block.module';
import { BotsModule } from '@warpy-be/bots/bots.module';
import { BroadcastModule } from '@warpy-be/broadcast/broadcast.module';
import { CandidateModule } from '@warpy-be/candidate/candidate.module';
import { CategoryModule } from '@warpy-be/categories/categories.module';
import { ChatModule } from '@warpy-be/chat/chat.module';
import { CoinBalanceModule } from '@warpy-be/coin-balance/coin-balance.module';
import { configuration } from '@warpy-be/config/configuration';
import { DeveloperAccountModule } from '@warpy-be/developer_account/developer_account.module';
import { FollowModule } from '@warpy-be/follow/follow.module';
import { FriendFeedModule } from '@warpy-be/friend_feed/friend_feed.module';
import { InviteModule } from '@warpy-be/invite/invite.module';
import { MediaModule } from '@warpy-be/media/media.module';
import { MessageModule } from '@warpy-be/message/message.module';
import { NatsModule } from '@warpy-be/nats/nats.module';
import { NotificationModule } from '@warpy-be/notification/notification.module';
import { ParticipantModule } from '@warpy-be/user/participant/participant.module';
import { ReactionModule } from '@warpy-be/reaction/reaction.module';
import { StreamBlockModule } from '@warpy-be/stream-block/stream-block.module';
import { StreamModule } from '@warpy-be/stream/stream.module';
import { UserReportModule } from '@warpy-be/user-report/user-report.module';
import { UserModule } from '@warpy-be/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';

export const testModuleBuilder = Test.createTestingModule({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CategoryModule,
    BotsModule,
    FriendFeedModule,
    AwardModule,
    CoinBalanceModule,
    DeveloperAccountModule,
    CandidateModule,
    UserModule,
    StreamModule,
    MessageModule,
    AppInviteModule,
    UserReportModule,
    MediaModule,
    WaitlistModule,
    StreamModule,
    StreamBlockModule,
    NatsModule,
    ParticipantModule,
    BlockModule,
    InviteModule,
    ChatModule,
    BroadcastModule,
    ReactionModule,
    FollowModule,
    NotificationModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
});
