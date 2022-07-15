import { Global, Module } from '@nestjs/common';
import { NjsBroadcastUserListStore } from './broadcast-user-list.store';
import { BroadcastController } from './broadcast.controller';
import { NjsBroadcastService } from './broadcast.service';

@Module({
  imports: [],
  controllers: [BroadcastController],
  providers: [NjsBroadcastService, NjsBroadcastUserListStore],
})
@Global()
export class BroadcastModule {}
