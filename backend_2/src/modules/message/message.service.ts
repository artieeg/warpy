import { Injectable } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';

@Injectable()
export class MessageService {
  constructor(private nc: NatsService) {}

  encodeMessage(data: any): Uint8Array {
    return this.nc.jc.encode(data);
  }

  sendMessage(user: string, message: any) {
    this.send(user, this.encodeMessage(message));
  }

  send(user: string, message: Uint8Array) {
    this.nc.publish(`reply.user.${user}`, message);
  }
}
