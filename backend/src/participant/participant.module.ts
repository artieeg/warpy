import { BotsModule } from '@backend_2/bots/bots.module';
import { TokenService } from '@backend_2/token/token.service';
import { forwardRef, Module } from '@nestjs/common';
import { BlockModule } from '../block/block.module';
import { MediaModule } from '../media/media.module';
import { MessageModule } from '../message/message.module';
import { StreamBlockModule } from '../stream-block/stream-block.module';
import { ParticipantCommonModule } from './common/participant-common.module';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ViewerModule } from './viewer/viewer.module';

@Module({
  imports: [
    ViewerModule,
    MediaModule,
    StreamBlockModule,
    forwardRef(() => BlockModule),
    BotsModule,
    MessageModule,
    TokenService,
    ParticipantCommonModule,
  ],
  providers: [ParticipantService],
  controllers: [ParticipantController],
  exports: [ParticipantService],
})
export class ParticipantModule {}
