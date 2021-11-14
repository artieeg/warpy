import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NatsService } from '../nats/nats.service';

@Injectable()
export class MessageService {
  constructor(private nc: NatsService) {}

  decodeMessage<T = any>(data: Uint8Array): T {
    return this.nc.jc.decode(data) as T;
  }

  encodeMessage(data: any): Uint8Array {
    return this.nc.jc.encode(data);
  }

  sendMessage(user: string, message: any) {
    this.send(user, this.encodeMessage(message));
  }

  send(user: string, message: Uint8Array) {
    this.nc.publish(`reply.user.${user}`, message);
  }

  @OnEvent('invite.stream-id-available')
  async notifyAboutStreamId({ id, user }: { id: string; user: string }) {
    this.sendMessage(user, {
      event: 'stream-id-available',
      data: {
        id,
      },
    });
  }

  async request<T>(user: string, request: any) {
    const response = await this.nc.request<T>(
      `request.user.${user}`,
      this.encodeMessage(request),
      { timeout: 90000 },
    );

    return response;
  }
}
