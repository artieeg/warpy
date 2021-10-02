import { Module } from '@nestjs/common';
import { PrismaModule } from '..';
import { MediaModule } from '../media/media.module';
import { StreamBlockModule } from '../stream-block/stream-block.module';
import { UserEntity } from '../user/user.entity';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [StreamBlockModule, PrismaModule, MediaModule],
  controllers: [StreamController],
  providers: [StreamService, UserEntity],
})
export class StreamModule {}
