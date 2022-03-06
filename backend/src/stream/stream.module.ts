import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { UserModule } from '@backend_2/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { ChatModule } from './chat/chat.module';
import { StreamController } from './stream.controller';
import { StreamEntity } from './stream.entity';
import { StreamService } from './stream.service';

@Module({
  imports: [
    PrismaModule,
    ChatModule,
    forwardRef(() => UserModule),
    MediaModule,
  ],
  controllers: [StreamController],
  providers: [StreamService, StreamEntity],
  exports: [StreamService, StreamEntity, ChatModule],
})
export class StreamModule {}
