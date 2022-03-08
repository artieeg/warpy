import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PreviousStreamService } from './previous-stream.service';

@Controller()
export class PreviousStreamController {
  constructor(private previousStreamService: PreviousStreamService) {}

  @OnEvent('user.disconnected')
  async onUserDisconnect({ user }: { user: string }) {
    await this.previousStreamService.expire(user);
  }
}
