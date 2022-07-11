import { BotsModule } from '@warpy-be/bots/bots.module';
import { NJTokenService } from '@warpy-be/token/token.service';
import { Module } from '@nestjs/common';
import { ActiveSpeakerModule } from './active-speaker/active-speaker.module';
import { ParticipantBanModule } from './ban/ban.module';
import { ParticipantCommonModule } from './store';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ParticipantRoleModule } from './role/role.module';
import { ViewerModule } from './viewer/viewer.module';
import { HostModule } from './host/host.module';
import { StreamerModule } from './streamer/streamer.module';

@Module({
  imports: [
    ViewerModule,
    StreamerModule,
    ActiveSpeakerModule,
    ParticipantRoleModule,
    ParticipantBanModule,
    ParticipantCommonModule,
    HostModule,
    BotsModule,
    NJTokenService,
  ],
  providers: [ParticipantService],
  controllers: [ParticipantController],
  exports: [ViewerModule, ParticipantCommonModule],
})
export class ParticipantModule {}
