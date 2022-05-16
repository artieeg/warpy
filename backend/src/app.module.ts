import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwardModule } from './award/award.module';
import { BotsModule } from './bots/bots.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { configuration } from './config/configuration';
import { GifModule } from './gif/gif.module';
import { MediaModule } from './media/media.module';
import { NatsModule } from './nats/nats.module';
import { NotificationModule } from './notification/notification.module';
import { StreamModule } from './stream/stream.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { MailModule } from './mail/mail.module';
import { MessageModule } from './message/message.module';
import { TimerModule } from './shared/modules/timer/timer.module';
import { SyncModule } from './sync/sync.module';
import { ChatModule } from './chat/chat.module';
import { FriendFeedModule } from './friend_feed/friend_feed.module';
import { BlockModule } from './block/block.module';
import { FeedModule } from './feed/feed.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    FollowModule,
    AwardModule,
    TimerModule,
    BroadcastModule,
    MediaModule,
    GifModule,
    FeedModule,
    UserModule,
    TokenModule,
    FriendFeedModule,
    StreamModule,
    MailModule,
    NatsModule,
    BotsModule,
    ChatModule,
    MessageModule,
    NotificationModule,
    WaitlistModule,
    SyncModule,
    BlockModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
