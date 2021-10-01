import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { connect, JSONCodec, NatsConnection } from 'nats';

export class NatsServer extends Server implements CustomTransportStrategy {
  nc: NatsConnection;
  jc = JSONCodec();

  private async subscribeTo(subject: string) {
    const sub = this.nc.subscribe(subject);

    for await (const msg of sub) {
      const message = this.jc.decode(msg.data);

      const response = await this.messageHandlers.get(subject)(message);

      msg.respond(this.jc.encode(response));
    }
  }

  async listen(callback: () => void) {
    this.nc = await connect({
      servers: [process.env.NATS_ADDR],
    });

    for (const subject of this.messageHandlers.keys()) {
      this.subscribeTo(subject);
    }
    callback();
  }

  close() {
    this.nc.close();
  }
}
