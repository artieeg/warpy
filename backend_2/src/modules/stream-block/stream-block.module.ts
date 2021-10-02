import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StreamBlockEntity } from './stream-block.entity';
import { StreamBlockService } from './stream-block.service';

@Module({
  imports: [PrismaModule],
  providers: [StreamBlockEntity, StreamBlockService],
  exports: [StreamBlockService],
})
export class StreamBlockModule {}
