import { Module } from '@nestjs/common';
import { ActiveSpeakerModule } from './active-speaker/active-speaker.module';
import { ParticipantCommonModule } from './common/participant-common.module';
import { ParticipantRoleModule } from './role/role.module';
import { ViewerModule } from './viewer/viewer.module';

@Module({
  imports: [
    ViewerModule,
    ActiveSpeakerModule,
    ParticipantRoleModule,
    ParticipantCommonModule,
  ],
  providers: [],
  controllers: [],
  exports: [ViewerModule, ParticipantCommonModule],
})
export class ParticipantModule {}
