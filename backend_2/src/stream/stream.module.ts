import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { UserModule } from '@backend_2/user/user.module';
import { Module } from '@nestjs/common';
import { BlockModule } from '../block/block.module';
import { MediaModule } from '../media/media.module';
import { ParticipantModule } from '../participant/participant.module';
import { StreamController } from './stream.controller';
import { StreamEntity } from './stream.entity';
import { StreamService } from './stream.service';

@Module({
  imports: [
    //StreamBlockModule,
    ParticipantModule,
    PrismaModule,
    BlockModule,
    UserModule,
    MediaModule,
  ],
  controllers: [StreamController],
  providers: [StreamService, StreamEntity],
  exports: [StreamService, StreamEntity],
})
export class StreamModule {}
