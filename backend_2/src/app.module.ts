import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockModule } from './modules/block/block.module';
import { BroadcastModule } from './modules/broadcast/broadcast.module';
import { FeedModule } from './modules/feed/feed.module';
import { MediaModule } from './modules/media/media.module';
import { NatsModule } from './modules/nats/nats.module';
import { ParticipantModule } from './modules/participant/participant.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { StreamBlockModule } from './modules/stream-block/stream-block.module';
import { StreamModule } from './modules/stream/stream.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    //PrismaModule,
    FeedModule,
    UserModule,
    StreamModule,
    MediaModule,
    StreamModule,
    StreamBlockModule,
    NatsModule,
    ParticipantModule,
    BlockModule,
    BroadcastModule,
    ReactionModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
