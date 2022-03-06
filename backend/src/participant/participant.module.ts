import { Module } from '@nestjs/common';
import { ParticipantCommonModule } from './common/participant-common.module';
import { ViewerModule } from './viewer/viewer.module';

@Module({
  imports: [ViewerModule, ParticipantCommonModule],
  providers: [],
  controllers: [],
  exports: [ViewerModule, ParticipantCommonModule],
})
export class ParticipantModule {}
