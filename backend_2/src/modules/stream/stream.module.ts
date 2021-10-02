import { Module } from '@nestjs/common';
import { PrismaModule, UserModule } from '..';
import { MediaModule } from '../media/media.module';
import { StreamBlockModule } from '../stream-block/stream-block.module';
import { UserEntity } from '../user/user.entity';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [StreamBlockModule, PrismaModule, UserModule, MediaModule],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
