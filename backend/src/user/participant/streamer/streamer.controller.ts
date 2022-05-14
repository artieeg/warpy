import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnNewStream } from '@warpy-be/interfaces';
import { EVENT_STREAM_CREATED } from '@warpy-be/utils';
import { StreamerService } from './streamer.service';

@Controller()
export class StreamerController implements OnNewStream {
  constructor(private streamerService: StreamerService) {}

  @OnEvent(EVENT_STREAM_CREATED)
  async onNewStream({ stream, hostNodeIds: { recvNodeId, sendNodeId } }) {
    const { owner, id } = stream;

    this.streamerService.createNewStreamer({
      user: owner,
      stream: id,
      recvNodeId,
      sendNodeId,
    });
  }
}
