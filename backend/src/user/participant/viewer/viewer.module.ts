import { MediaModule } from '@warpy-be/media/media.module';
import { UserModule } from '@warpy-be/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { ParticipantBanModule } from '../ban/ban.module';
import { ViewerController } from './viewer.controller';
import { ViewerService } from './viewer.service';
import {HostModule} from '../host/host.module';

@Module({
  imports: [MediaModule, HostModule, forwardRef(() => UserModule), ParticipantBanModule],
  providers: [ViewerService],
  controllers: [ViewerController],
  exports: [ViewerService],
})
export class ViewerModule {}
