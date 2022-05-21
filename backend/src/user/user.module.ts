import { StreamModule } from '@warpy-be/stream/stream.module';
import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenModule } from '../token/token.module';
import { AppInviteModule } from './app_invite/app-invite.module';
import { DeveloperAccountModule } from './developer_account/developer_account.module';
import { UserOnlineStatusModule } from './online-status/user-online-status.module';
import { ParticipantModule } from './participant/participant.module';
import { UserReportModule } from './report/user-report.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { BlockModule } from '@warpy-be/block/block.module';
import { FollowModule } from '@warpy-be/follow/follow.module';

@Module({
  imports: [
    PrismaModule,
    FollowModule,
    //forwardRef(() => StreamModule),
    StreamModule,
    TokenModule,
    ParticipantModule,
    UserOnlineStatusModule,
    UserReportModule,
    BlockModule,
    AppInviteModule,
    DeveloperAccountModule,
  ],
  controllers: [UserController],
  providers: [UserEntity, UserService],
  exports: [
    UserEntity,
    UserService,
    ParticipantModule,
    DeveloperAccountModule,
    FollowModule,
  ],
})
export class UserModule {}
