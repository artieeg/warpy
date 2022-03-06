import { BlockModule } from '@backend_2/block/block.module';
import { BotsModule } from '@backend_2/bots/bots.module';
import { MediaModule } from '@backend_2/media/media.module';
import { MessageModule } from '@backend_2/message/message.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { StreamBlockModule } from '@backend_2/stream-block/stream-block.module';
import { TokenService } from '@backend_2/token/token.service';
import { forwardRef, Global, Module } from '@nestjs/common';
import { ParticipantCommonController } from './participant-common.controller';
import { ParticipantCommonService } from './participant-common.service';
import { ParticipantEntity } from './participant.entity';

@Module({
  imports: [
    PrismaModule,
    StreamBlockModule,
    BotsModule,
    MediaModule,
    MessageModule,
    TokenService,
    forwardRef(() => BlockModule),
  ],
  providers: [ParticipantEntity, ParticipantCommonService],
  controllers: [ParticipantCommonController],
  exports: [ParticipantEntity, ParticipantCommonService],
})
@Global()
export class ParticipantCommonModule {}
