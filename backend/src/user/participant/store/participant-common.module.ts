import { BotsModule } from '@backend_2/bots/bots.module';
import { MediaModule } from '@backend_2/media/media.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { TokenService } from '@backend_2/token/token.service';
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
