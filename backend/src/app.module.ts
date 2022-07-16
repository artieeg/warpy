import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/configuration';
import { TimerModule } from './shared/modules/timer/timer.module';
/*
import {
  UserBlockModule,
  BotInstanceModule,
  PreviousStreamModule,
  PrismaModule,
  ReactionModule,
  StreamModule,
  BotsModule,
  BroadcastModule,
} from './modules';
*/

import * as modules from './modules';

export const appModuleImports = [
  ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
  }),

  TimerModule,
  ...Object.values(modules),
  /*
  PrismaModule,
  //AwardModule,
  CategoryModule,
  TimerModule,
  BroadcastModule,
  MediaModule,
  GifModule,
  FeedModule,
  UserModule,
  UserListModule,
  TokenModule,
  FriendFeedModule,
  UserDataFetcherModule,
  StreamModule,
  ReactionModule,
  PreviousStreamModule,
  BotInstanceModule,
  //MailModule,
  NatsModule,
  BotsModule,
  ChatModule,
  MessageModule,
  NotificationModule,
  //WaitlistModule,
  SyncModule,
  InviteModule,
  UserBlockModule,
  FollowModule,
  */
  EventEmitterModule.forRoot(),
];

@Module({
  imports: appModuleImports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
