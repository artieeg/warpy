import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StreamNodeAssignerService } from './stream-node-assigner.service';

@Controller()
export class StreamNodeAssignerController {
  constructor(private streamNodeAssignerService: StreamNodeAssignerService) {}

  @OnEvent('stream.stopped')
  async onStreamStop({ stream }: { stream: string }) {
    await this.streamNodeAssignerService.del(stream);
  }
}
