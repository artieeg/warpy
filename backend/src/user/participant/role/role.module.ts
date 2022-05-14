import { MediaModule } from '@warpy-be/media/media.module';
import { Module } from '@nestjs/common';
import { ParticipantRoleController } from './role.controller';
import { ParticipantRoleService } from './role.service';
import { HostModule } from '../host/host.module';
import { BlockModule } from '@warpy-be/block/block.module';

@Module({
  imports: [BlockModule, HostModule, MediaModule],
  providers: [ParticipantRoleService],
  controllers: [ParticipantRoleController],
  exports: [],
})
export class ParticipantRoleModule {}
