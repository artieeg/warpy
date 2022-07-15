import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { NjsDeveloperAccountStore } from './developer_account.entity';

@Module({
  imports: [PrismaModule],
  providers: [NjsDeveloperAccountStore],
  controllers: [],
  exports: [NjsDeveloperAccountStore],
})
export class DeveloperAccountModule {}
