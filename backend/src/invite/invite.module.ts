import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { InviteEntity } from './invite.entity';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { StreamModule } from '@backend_2/stream/stream.module';
import { MessageModule } from '@backend_2/message/message.module';
import { TokenModule } from '@backend_2/token/token.module';
import { BotsModule } from '@backend_2/bots/bots.module';
import { UserModule } from '@backend_2/user/user.module';

@Module({
  imports: [
    PrismaModule,
    StreamModule,
    UserModule,
    MessageModule,
    TokenModule,
    BotsModule,
  ],
  providers: [InviteEntity, InviteService],
  controllers: [InviteController],
  exports: [],
})
export class InviteModule {}
