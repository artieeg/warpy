import { UserModule } from '@backend_2/user/user.module';
import { forwardRef, Global, Module } from '@nestjs/common';
import {BroadcastController} from './broadcast.controller';
import { BroadcastService } from './broadcast.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [BroadcastController],
  providers: [BroadcastService],
})
@Global()
export class BroadcastModule {}
