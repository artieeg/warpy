import { Module } from '@nestjs/common';
import { NjsParticipantNodeAssignerStore } from './participant-node-assigner.store';

@Module({
  imports: [],
  providers: [NjsParticipantNodeAssignerStore],
  controllers: [],
  exports: [NjsParticipantNodeAssignerStore],
})
export class ParticipantNodeAssignerModule {}
