import { MediaModule } from '@backend_2/media/media.module';
import { StreamBlockModule } from '@backend_2/stream-block/stream-block.module';
import { Module } from '@nestjs/common';
import { ViewerController } from './viewer.controller';
import { ViewerService } from './viewer.service';

@Module({
  imports: [MediaModule, StreamBlockModule],
  providers: [ViewerService],
  controllers: [ViewerController],
  exports: [ViewerService],
})
export class ViewerModule {}
