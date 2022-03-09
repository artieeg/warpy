import { UserModule } from '@backend_2/user/user.module';
import { forwardRef, Global, Module } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [BroadcastService],
})
@Global()
export class BroadcastModule {}
