import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { StreamCommonModule } from './common/stream-common.module';
import { PreviousStreamModule } from './previous-stream/previous-stream.module';
import { ReactionModule } from './reaction/reaction.module';
import { StreamController } from './stream.controller';
import { NjsStreamService } from './stream.service';

@Module({
  imports: [
    PrismaModule,
    MediaModule,
    StreamCommonModule,
    PreviousStreamModule,
    ReactionModule,
  ],
  controllers: [StreamController],
  providers: [NjsStreamService],
  exports: [NjsStreamService, StreamCommonModule, ReactionModule],
})
export class StreamModule {}
