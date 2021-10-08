import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, RequestOptions, JSONCodec, NatsConnection } from 'nats';

@Injectable()
export class NatsService implements OnModuleInit {
  private nc: NatsConnection;
  public jc = JSONCodec();

  constructor() {}

  async onModuleInit() {
    this.nc = await connect({
      servers: [process.env.NATS_ADDR],
    });
  }

  async request(
    subject: string,
    message: Uint8Array | any,
    opts?: RequestOptions,
  ) {
    let payload =
      message instanceof Uint8Array ? message : this.jc.encode(message);

    const { data } = await this.nc.request(subject, payload, opts);

    return this.jc.decode(data);
  }

  publish(subject: string, message: Uint8Array) {
    this.nc.publish(subject, message);
  }
}
