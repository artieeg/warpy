import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ParticipantBanEntity } from './ban.entity';
import { ParticipantBanService } from './ban.service';

@Module({
  imports: [PrismaModule],
  providers: [ParticipantBanService, ParticipantBanEntity],
  controllers: [],
  exports: [ParticipantBanService],
})
export class ParticipantBanModule {}
