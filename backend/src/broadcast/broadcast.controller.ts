import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BroadcastService } from './broadcast.service';

@Controller()
export class BroadcastController {
  constructor(private broadcastService: BroadcastService) {}

  @OnEvent('participant.media-toggle')
  async onMediaToggle() {}
}
