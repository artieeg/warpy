import { forwardRef, Module } from '@nestjs/common';
import { InviteEntity } from './invite.entity';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { MessageModule } from '@backend_2/message/message.module';
import { TokenModule } from '@backend_2/token/token.module';
import { BotsModule } from '@backend_2/bots/bots.module';
import { UserModule } from '@backend_2/user/user.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { StreamModule } from '../stream.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => StreamModule),
    forwardRef(() => UserModule),
    MessageModule,
    TokenModule,
    BotsModule,
  ],
  providers: [InviteEntity, InviteService],
  controllers: [InviteController],
  exports: [],
})
export class InviteModule {}
