import { IStreamStore } from 'lib';
import { IMessageService } from 'lib/message';
import { IPreviousStreamStore } from './previous-stream.store';

export interface IPreviousStreamService {
  clearStream(stream: string): Promise<void>;
  set(user: string, stream: string): Promise<void>;
  sendPreviousStream(user: string): Promise<void>;
  expire(user: string): Promise<void>;
}

export class PreviousStreamService {
  constructor(
    private previousStreamCache: IPreviousStreamStore,
    private messageService: IMessageService,
    private streamEntity: IStreamStore,
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
