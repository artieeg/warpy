import { MediaModule } from '@warpy-be/media/media.module';
import { BlockModule } from '@warpy-be/user/block/block.module';
import { forwardRef, Module } from '@nestjs/common';
import { ParticipantRoleController } from './role.controller';
import { ParticipantRoleService } from './role.service';
import { HostModule } from '../host/host.module';

@Module({
  imports: [forwardRef(() => BlockModule), HostModule, MediaModule],
  providers: [ParticipantRoleService],
  controllers: [ParticipantRoleController],
  exports: [],
})
export class ParticipantRoleModule {}
