import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockModule } from './block/block.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { ChatModule } from './chat/chat.module';
import { FeedModule } from './feed/feed.module';
import { FollowModule } from './follow/follow.module';
import { MediaModule } from './media/media.module';
import { NatsModule } from './nats/nats.module';
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
    ChatModule,
    BroadcastModule,
    ReactionModule,
    FollowModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
