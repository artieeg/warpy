import { UserModule } from '@backend_2/user/user.module';
import { forwardRef, Global, Module } from '@nestjs/common';
import { BroadcastUserListStore } from './broadcast-user-list.store';
import { BroadcastController } from './broadcast.controller';
import { BroadcastService } from './broadcast.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [BroadcastController],
  providers: [BroadcastService, BroadcastUserListStore],
})
@Global()
export class BroadcastModule {}
