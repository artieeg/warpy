import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockModule } from './block/block.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { ChatModule } from './chat/chat.module';
import { configuration } from './config/configuration';
import { FeedModule } from './feed/feed.module';
import { FollowModule } from './follow/follow.module';
import { InviteModule } from './invite/invite.module';
import { MediaModule } from './media/media.module';
import { NatsModule } from './nats/nats.module';
import { NotificationModule } from './notification/notification.module';
import { ParticipantModule } from './participant/participant.module';
import { ReactionModule } from './reaction/reaction.module';
import { StreamBlockModule } from './stream-block/stream-block.module';
import { StreamModule } from './stream/stream.module';
import { UserReportModule } from './user-report/user-report.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    //PrismaModule,
    FeedModule,
    UserModule,
    StreamModule,
    UserReportModule,
    MediaModule,
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
