import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { UserModule } from '@backend_2/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { CategoryModule } from './categories/categories.module';
import { ChatModule } from './chat/chat.module';
import { InviteModule } from './invite/invite.module';
import { StreamController } from './stream.controller';
import { StreamEntity } from './stream.entity';
import { StreamService } from './stream.service';

@Module({
  imports: [
    PrismaModule,
    ChatModule,
    forwardRef(() => UserModule),
    MediaModule,
    CategoryModule,
    InviteModule,
  ],
  controllers: [StreamController],
  providers: [StreamService, StreamEntity],
  exports: [
    StreamService,
    CategoryModule,
    StreamEntity,
    ChatModule,
    InviteModule,
  ],
})
export class StreamModule {}
