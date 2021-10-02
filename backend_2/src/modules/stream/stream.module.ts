import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StreamBlockModule } from '../stream-block/stream-block.module';
import { UserEntity } from '../user/user.entity';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [StreamBlockModule],
  controllers: [StreamController],
  providers: [PrismaService, StreamService, UserEntity],
})
export class StreamModule {}
