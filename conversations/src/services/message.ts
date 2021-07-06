import { EventEmitter } from "events";
import { connect, JSONCodec, NatsConnection } from "nats";
import { IStream } from "@app/models";

const eventEmitter = new EventEmitter();

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;
const jc = JSONCodec();

export const init = async () => {
  nc = await connect({ servers: [NATS] });

  handleNewStream();
};

type Events = "new-conversation";

export const on = (event: Events, handler: any) => {
  eventEmitter.on(event, handler);
};

const handleNewStream = async () => {
  const sub = nc.subscribe("stream.created");

  for await (const msg of sub) {
    const message = jc.decode(msg.data) as any;

    const newStream: IStream = {
      id: message.id,
      owner: message.owner,
    };

    eventEmitter.emit("new-conversation", newStream);
  }
};
