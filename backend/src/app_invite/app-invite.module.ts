import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppInviteEntity } from './app-invite.entity';

@Module({
  imports: [PrismaModule],
  providers: [AppInviteEntity],
  controllers: [],
  exports: [],
})
export class AppInviteModule {}
