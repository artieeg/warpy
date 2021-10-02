import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { connect, JSONCodec, Msg, NatsConnection } from 'nats';
import { catchError, Observable, of } from 'rxjs';

export class NatsServer extends Server implements CustomTransportStrategy {
  nc: NatsConnection;
  jc = JSONCodec();

  sendResponse(msg: Msg, data: any) {
    msg.respond(this.jc.encode(data));
  }

  private async subscribeTo(subject: string) {
    const sub = this.nc.subscribe(subject);

    for await (const msg of sub) {
      const message = this.jc.decode(msg.data);

      const response = await this.messageHandlers.get(subject)(message);

      if (response instanceof Observable) {
        response.subscribe({
          next: (value) => this.sendResponse(msg, value),
          error: (err) => this.sendResponse(msg, err),
        });
      } else {
        this.sendResponse(msg, response);
      }

      /*
      response
        .pipe(({}) => this.sendResponse(msg, response))
        .pipe(
          catchError((e) => {
            this.sendResponse(msg, e);
          }),
        );

      response.subscribe(
        (response) => this.sendResponse(msg, response),
        (err) => this.sendResponse(msg, err),
      );
        */
      //response.pipe(catchError((err) => of({ error: err }))).pipe();

      //msg.respond(this.jc.encode(response));
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
