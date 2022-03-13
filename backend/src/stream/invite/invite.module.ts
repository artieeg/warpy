import { forwardRef, Module } from '@nestjs/common';
import { InviteEntity } from './invite.entity';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { TokenModule } from '@backend_2/token/token.module';
import { BotsModule } from '@backend_2/bots/bots.module';
import { UserModule } from '@backend_2/user/user.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { StreamCommonModule } from '../common/stream-common.module';

@Module({
  imports: [
    PrismaModule,
    StreamCommonModule,
    forwardRef(() => UserModule),
    TokenModule,
    forwardRef(() => BotsModule),
  ],
  providers: [InviteEntity, InviteService],
  controllers: [InviteController],
  exports: [],
})
export class InviteModule {}
