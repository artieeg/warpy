import { MediaModule } from '@warpy-be/media/media.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { NjsStreamBanStore } from './ban.entity';
import { NjsStreamBanService } from './ban.service';

@Module({
  imports: [PrismaModule, MediaModule],
  providers: [NjsStreamBanService, NjsStreamBanStore],
  controllers: [],
  exports: [NjsStreamBanService],
})
export class ParticipantBanModule {}
