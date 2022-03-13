import { MediaModule } from '@warpy-be/media/media.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ParticipantBanEntity } from './ban.entity';
import { ParticipantBanService } from './ban.service';

@Module({
  imports: [PrismaModule, MediaModule],
  providers: [ParticipantBanService, ParticipantBanEntity],
  controllers: [],
  exports: [ParticipantBanService],
})
export class ParticipantBanModule {}
