import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Global, Module } from '@nestjs/common';
import { ParticipantStore } from './participant.store';

@Module({
  imports: [PrismaModule],
  providers: [ParticipantStore],
  controllers: [],
  exports: [ParticipantStore],
})
@Global()
export class ParticipantCommonModule {}
