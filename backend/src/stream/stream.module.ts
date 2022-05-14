import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { CategoryModule } from './categories/categories.module';
import { StreamCommonModule } from './common/stream-common.module';
import { PreviousStreamModule } from './previous-stream/previous-stream.module';
import { ReactionModule } from './reaction/reaction.module';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [
    PrismaModule,
    MediaModule,
    CategoryModule,
    StreamCommonModule,
    PreviousStreamModule,
    ReactionModule,
  ],
  controllers: [StreamController],
  providers: [StreamService],
  exports: [StreamService, StreamCommonModule, CategoryModule, ReactionModule],
})
export class StreamModule {}
