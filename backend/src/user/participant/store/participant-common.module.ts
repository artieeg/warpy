import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Global, Module } from '@nestjs/common';
import { NjsParticipantStore } from './participant.store';
import { ParticipantStoreController } from './participant-store.controller';

@Module({
  imports: [PrismaModule],
  providers: [NjsParticipantStore],
  controllers: [ParticipantStoreController],
  exports: [NjsParticipantStore],
})
@Global()
export class ParticipantCommonModule {}
