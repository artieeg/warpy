import { OnInstanceInit } from 'lib/OnInstanceInit.interface';
import { connect, RequestOptions, JSONCodec, NatsConnection } from 'nats';

export interface INatsService extends OnInstanceInit {
  request<T = any>(
    subject: string,
    message: Uint8Array | any,
    opts?: RequestOptions,
  ): Promise<T>;
  publish(subject: string, message: Uint8Array): void;
}

export class NatsService implements INatsService {
  private nc: NatsConnection;
  public jc = JSONCodec();

  constructor() {}

  async onInstanceInit() {
    this.nc = await connect({
      servers: [process.env.NATS_ADDR],
    });
  }

  async request<T = any>(
    subject: string,
    message: Uint8Array | any,
    opts?: RequestOptions,
  ): Promise<T> {
    let payload =
      message instanceof Uint8Array ? message : this.jc.encode(message);

    const { data } = await this.nc.request(subject, payload, opts);

    return this.jc.decode(data) as T;
  }

  publish(subject: string, message: Uint8Array) {
    this.nc.publish(subject, message);
  }
}
