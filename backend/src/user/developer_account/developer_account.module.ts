import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { DeveloperAccountEntity } from './developer_account.entity';

@Module({
  imports: [PrismaModule],
  providers: [DeveloperAccountEntity],
  controllers: [],
  exports: [DeveloperAccountEntity],
})
export class DeveloperAccountModule {}
