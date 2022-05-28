import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '@warpy-be/user/user.module';
import { ParticipantCommonModule } from '../store';
import { HostController } from './host.controller';
import { HostService } from './host.service';
import { HostStore } from './host.store';

@Module({
  imports: [ParticipantCommonModule, forwardRef(() => UserModule)],
  providers: [HostStore, HostService],
  controllers: [HostController],
  exports: [HostService],
})
export class HostModule {}
