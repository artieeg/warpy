import { MessageService } from '../message';

type BroadcastData<T = any> = {
  event: string;
  data: T;
};

export class BroadcastService {
  constructor(private messageService: MessageService) {}

  private _broadcast(ids: string[], message: Uint8Array) {
    ids.forEach((id) => this.messageService.send(id, message));
  }

  broadcast(ids: string[], payload: BroadcastData) {
    const enc = this.messageService.encodeMessage(payload);

    this._broadcast(ids, enc);
  }
}
