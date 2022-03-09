import { BotsModule } from '@backend_2/bots/bots.module';
import { MediaModule } from '@backend_2/media/media.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { TokenService } from '@backend_2/token/token.service';
import { forwardRef, Global, Module } from '@nestjs/common';
import { ParticipantCommonController } from './participant-common.controller';
import { ParticipantCommonService } from './participant-common.service';
import { ParticipantEntity } from './participant.entity';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => BotsModule),
    MediaModule,
    TokenService,
  ],
  providers: [ParticipantEntity, ParticipantCommonService],
  controllers: [ParticipantCommonController],
  exports: [ParticipantEntity, ParticipantCommonService],
})
@Global()
export class ParticipantCommonModule {}
