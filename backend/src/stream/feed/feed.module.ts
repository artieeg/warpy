import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '@warpy-be/user/user.module';
import { StreamCommonModule } from '../common/stream-common.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [PrismaModule, StreamCommonModule, forwardRef(() => UserModule)],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
