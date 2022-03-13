import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { UserModule } from '@warpy-be/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { CategoryModule } from './categories/categories.module';
import { ChatModule } from './chat/chat.module';
import { StreamCommonModule } from './common/stream-common.module';
import { FeedModule } from './feed/feed.module';
import { InviteModule } from './invite/invite.module';
import { PreviousStreamModule } from './previous-stream/previous-stream.module';
import { ReactionModule } from './reaction/reaction.module';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [
    PrismaModule,
    ChatModule,
    forwardRef(() => UserModule),
    MediaModule,
    CategoryModule,
    StreamCommonModule,
    PreviousStreamModule,
    InviteModule,
    ReactionModule,
    FeedModule,
  ],
  controllers: [StreamController],
  providers: [StreamService],
  exports: [
    StreamService,
    StreamCommonModule,
    CategoryModule,
    ChatModule,
    InviteModule,
    ReactionModule,
  ],
})
export class StreamModule {}
