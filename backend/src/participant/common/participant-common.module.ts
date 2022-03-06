import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Global, Module } from '@nestjs/common';
import { ParticipantEntity } from './participant.entity';

@Module({
  imports: [PrismaModule],
  providers: [ParticipantEntity],
  controllers: [],
  exports: [ParticipantEntity],
})
@Global()
export class ParticipantCommonModule {}
