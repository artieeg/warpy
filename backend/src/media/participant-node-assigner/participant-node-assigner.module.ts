import { Module } from '@nestjs/common';
import { ParticipantNodeAssignerStore } from './participant-node-assigner.store';

@Module({
  imports: [],
  providers: [ParticipantNodeAssignerStore],
  controllers: [],
  exports: [ParticipantNodeAssignerStore],
})
export class ParticipantNodeAssignerModule {}
