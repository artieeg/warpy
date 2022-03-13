import { BotsModule } from '@warpy-be/bots/bots.module';
import { MediaModule } from '@warpy-be/media/media.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { TokenService } from '@warpy-be/token/token.service';
import { forwardRef, Global, Module } from '@nestjs/common';
import { ParticipantStore } from './participant.entity';

@Module({
  imports: [PrismaModule],
  providers: [ParticipantStore],
  controllers: [],
  exports: [ParticipantStore],
})
@Global()
export class ParticipantCommonModule {}
