import { MessageService } from '@warpy-be/app/message';
import { StreamStore } from '@warpy-be/app/stream';
import { PreviousStreamStore } from './previous-stream.store';

export class PreviousStreamService {
  constructor(
    private previousStreamStore: PreviousStreamStore,
    private messageService: MessageService,
    private streamStore: StreamStore,
  ) {}

  async clearStream(stream: string) {
    await this.previousStreamStore.delStream(stream);
  }

  async set(user: string, stream: string) {
    return this.previousStreamStore.set(user, stream);
  }

  async sendPreviousStream(user: string) {
    const stream_id = await this.previousStreamStore.get(user);

    if (stream_id) {
      const stream = await this.streamStore.findById(stream_id);

      if (stream) {
        this.messageService.sendMessage(user, {
          event: 'previous-stream',
          data: {
            stream,
          },
        });
      }
    }
  }

  async expire(user: string) {
    await this.previousStreamStore.expire(user);
  }
}
