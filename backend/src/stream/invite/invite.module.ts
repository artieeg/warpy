import { forwardRef, Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { TokenModule } from '@warpy-be/token/token.module';
import { BotsModule } from '@warpy-be/bots/bots.module';
import { UserModule } from '@warpy-be/user/user.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { StreamCommonModule } from '../common/stream-common.module';
import { InviteStore } from './invite.store';

@Module({
  imports: [
    PrismaModule,
    StreamCommonModule,
    //forwardRef(() => UserModule),
    UserModule,
    TokenModule,
    forwardRef(() => BotsModule),
  ],
  providers: [InviteStore, InviteService],
  controllers: [InviteController],
  exports: [],
})
export class InviteModule {}
