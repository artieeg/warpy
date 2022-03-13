import { MediaModule } from '@warpy-be/media/media.module';
import { BlockModule } from '@warpy-be/user/block/block.module';
import { forwardRef, Module } from '@nestjs/common';
import { ParticipantRoleController } from './role.controller';
import { ParticipantRoleService } from './role.service';

@Module({
  imports: [forwardRef(() => BlockModule), MediaModule],
  providers: [ParticipantRoleService],
  controllers: [ParticipantRoleController],
  exports: [],
})
export class ParticipantRoleModule {}
