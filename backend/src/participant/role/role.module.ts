import { BlockModule } from '@backend_2/block/block.module';
import { MediaModule } from '@backend_2/media/media.module';
import { MessageModule } from '@backend_2/message/message.module';
import { forwardRef, Module } from '@nestjs/common';
import { ParticipantRoleController } from './role.controller';
import { ParticipantRoleService } from './role.service';

@Module({
  imports: [forwardRef(() => BlockModule), MessageModule, MediaModule],
  providers: [ParticipantRoleService],
  controllers: [ParticipantRoleController],
  exports: [],
})
export class ParticipantRoleModule {}
