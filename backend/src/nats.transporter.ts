import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { connect, JSONCodec, Msg, NatsConnection } from 'nats';
import { Observable } from 'rxjs';

export class NatsServer extends Server implements CustomTransportStrategy {
  nc: NatsConnection;
  jc = JSONCodec();

  sendResponse(msg: Msg, data: any) {
    try {
      msg.respond(this.jc.encode(data));
    } catch (e) {}
  }

  private async subscribeTo(subject: string) {
    const sub = this.nc.subscribe(subject);

    for await (const msg of sub) {
      const message = this.jc.decode(msg.data);

      const response = await this.messageHandlers.get(subject)(message);

      if (response instanceof Observable) {
        try {
          response.subscribe({
            next: (value) => this.sendResponse(msg, value),
            error: (err) =>
              this.sendResponse(msg, {
                status: 'error',
                data: err,
              }),
          });
        } catch (e) {}
      } else {
        this.sendResponse(msg, response);
      }
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
