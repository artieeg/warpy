import { Module } from '@nestjs/common';
import { DeveloperAccountEntity } from './developer_account.entity';

@Module({
  imports: [],
  providers: [DeveloperAccountEntity],
  controllers: [],
  exports: [DeveloperAccountEntity],
})
export class DeveloperAccountModule {}
