import { Module } from '@nestjs/common';
import { UserModule } from '@warpy-be/user/user.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { BlockModule } from '@warpy-be/block/block.module';
import { StreamModule } from '@warpy-be/stream/stream.module';

@Module({
  imports: [PrismaModule, StreamModule, BlockModule, UserModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
