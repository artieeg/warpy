import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '@warpy-be/user/user.module';
import { ParticipantCommonModule } from '../store';
import { HostController } from './host.controller';
import { NjsHostService } from './host.service';
import { NjsHostStore } from './host.store';

@Module({
  imports: [ParticipantCommonModule, forwardRef(() => UserModule)],
  providers: [NjsHostStore, NjsHostService],
  controllers: [HostController],
  exports: [NjsHostService],
})
export class HostModule {}
