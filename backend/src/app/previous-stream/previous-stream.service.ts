import { MessageService } from '@warpy-be/app/message';
import { StreamStore } from '@warpy-be/app/stream';
import { PreviousStreamStore } from './previous-stream.store';

export class PreviousStreamService {
  constructor(
    private previousStreamCache: PreviousStreamStore,
    private messageService: MessageService,
    private streamEntity: StreamStore,
  ) {}

  async clearStream(stream: string) {
    await this.previousStreamCache.delStream(stream);
  }

  async set(user: string, stream: string) {
    return this.previousStreamCache.set(user, stream);
  }

  async sendPreviousStream(user: string) {
    const stream_id = await this.previousStreamCache.get(user);

    if (stream_id) {
      const stream = await this.streamEntity.findById(stream_id);

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
    await this.previousStreamCache.expire(user);
  }
}
