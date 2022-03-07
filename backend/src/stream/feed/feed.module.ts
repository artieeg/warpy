import { forwardRef, Module } from '@nestjs/common';
import { BlockModule } from '@backend_2/user/block/block.module';
import { UserModule } from '@backend_2/user/user.module';
import { StreamCommonModule } from '../common/stream-common.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [
    PrismaModule,
    BlockModule,
    StreamCommonModule,
    forwardRef(() => UserModule),
  ],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
