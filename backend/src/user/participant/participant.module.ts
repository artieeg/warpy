import { BotsModule } from '@backend_2/bots/bots.module';
import { MediaModule } from '@backend_2/media/media.module';
import { TokenService } from '@backend_2/token/token.service';
import { forwardRef, Module } from '@nestjs/common';
import { ActiveSpeakerModule } from './active-speaker/active-speaker.module';
import { ParticipantBanModule } from './ban/ban.module';
import { ParticipantCommonModule } from './store';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ParticipantRoleModule } from './role/role.module';
import { ViewerModule } from './viewer/viewer.module';

@Module({
  imports: [
    ViewerModule,
    ActiveSpeakerModule,
    ParticipantRoleModule,
    ParticipantBanModule,
    ParticipantCommonModule,
    forwardRef(() => BotsModule),
    MediaModule,
    TokenService,
  ],
  providers: [ParticipantService],
  controllers: [ParticipantController],
  exports: [ViewerModule, ParticipantCommonModule],
})
export class ParticipantModule {}
