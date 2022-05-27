import { Module } from '@nestjs/common';
import { ParticipantCommonModule } from '../store';
import { HostController } from './host.controller';
import { HostService } from './host.service';
import { HostStore } from './host.store';

@Module({
  imports: [ParticipantCommonModule],
  providers: [HostStore, HostService],
  controllers: [HostController],
  exports: [HostService],
})
export class HostModule {}
