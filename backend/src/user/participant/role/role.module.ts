import { MediaModule } from '@warpy-be/media/media.module';
import { Module } from '@nestjs/common';
import { ParticipantRoleController } from './role.controller';
import { NjsParticipantRoleService } from './role.service';
import { HostModule } from '../host/host.module';
import { BlockModule } from '@warpy-be/block/block.module';

@Module({
  imports: [BlockModule, HostModule, MediaModule],
  providers: [NjsParticipantRoleService],
  controllers: [ParticipantRoleController],
  exports: [NjsParticipantRoleService],
})
export class ParticipantRoleModule {}
