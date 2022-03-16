import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Global, Module } from '@nestjs/common';
import { ParticipantStore } from './participant.store';
import { ParticipantStoreController } from './participant-store.controller';

@Module({
  imports: [PrismaModule],
  providers: [ParticipantStore],
  controllers: [ParticipantStoreController],
  exports: [ParticipantStore],
})
@Global()
export class ParticipantCommonModule {}
