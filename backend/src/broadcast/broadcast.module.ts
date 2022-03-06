import { UserModule } from '@backend_2/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { BroadcastService } from './broadcast.service';

@Module({
  imports: [MessageModule, forwardRef(() => UserModule)],
  providers: [BroadcastService],
})
export class BroadcastModule {}
