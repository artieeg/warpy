import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwardModule } from './award/award.module';
import { BotsModule } from './bots/bots.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { configuration } from './config/configuration';
import { CandidateModule } from './candidate/candidate.module';
import { GifModule } from './gif/gif.module';
import { InviteModule } from './invite/invite.module';
import { MediaModule } from './media/media.module';
import { NatsModule } from './nats/nats.module';
import { NotificationModule } from './notification/notification.module';
import { ReactionModule } from './reaction/reaction.module';
import { StreamModule } from './stream/stream.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { MailModule } from './mail/mail.module';
import { ChatModule } from './stream/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AwardModule,
    BroadcastModule,
    MediaModule,
    GifModule,
    CandidateModule,
    UserModule,
    TokenModule,
    StreamModule,
    MailModule,
    NatsModule,
    BotsModule,
    InviteModule,
    ChatModule,
    ReactionModule,
    NotificationModule,
    WaitlistModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
