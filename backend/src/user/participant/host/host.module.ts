import { Module } from '@nestjs/common';
import { HostController } from './host.controller';
import { HostStore } from './host.store';

@Module({
  imports: [],
  providers: [HostStore],
  controllers: [HostController],
  exports: [],
})
export class HostModule {}
