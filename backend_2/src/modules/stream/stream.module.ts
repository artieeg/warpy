import { Module } from '@nestjs/common';
import { PrismaModule, UserModule } from '..';
import { BlockModule } from '../block/block.module';
import { MediaModule } from '../media/media.module';
import { ParticipantModule } from '../participant/participant.module';
import { StreamBlockModule } from '../stream-block/stream-block.module';
import { StreamController } from './stream.controller';
import { StreamEntity } from './stream.entity';
import { StreamService } from './stream.service';

@Module({
  imports: [
    //StreamBlockModule,
    ParticipantModule,
    PrismaModule,
    BlockModule,
    UserModule,
    MediaModule,
  ],
  controllers: [StreamController],
  providers: [StreamService, StreamEntity],
  exports: [StreamService, StreamEntity],
})
export class StreamModule {}
