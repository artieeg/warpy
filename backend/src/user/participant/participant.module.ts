import { BotsModule } from '@warpy-be/bots/bots.module';
import { NJTokenService } from '@warpy-be/token/token.service';
import { forwardRef, Module } from '@nestjs/common';
import { ActiveSpeakerModule } from './active-speaker/active-speaker.module';
import { ParticipantBanModule } from './ban/ban.module';
import { ParticipantCommonModule } from './store';
import { ParticipantController } from './participant.controller';
import { NjsParticipantService } from './participant.service';
import { ParticipantRoleModule } from './role/role.module';
import { ViewerModule } from './viewer/viewer.module';
import { HostModule } from './host/host.module';
import { StreamerModule } from './streamer/streamer.module';
import { MediaModule } from '@warpy-be/media/media.module';
import { UserModule } from '../user.module';
import { NjsStreamJoiner } from './stream-joiner.service';

@Module({
  imports: [
    MediaModule,
    ViewerModule,
    StreamerModule,
    ActiveSpeakerModule,
    ParticipantRoleModule,
    ParticipantBanModule,
    ParticipantCommonModule,
    HostModule,
    BotsModule,
    forwardRef(() => UserModule),
    NJTokenService,
  ],
  providers: [NjsParticipantService, NjsStreamJoiner],
  controllers: [ParticipantController],
  exports: [ViewerModule, ParticipantCommonModule],
})
export class ParticipantModule {}
