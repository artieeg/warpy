import EventEmitter from "events";
import { connect, JSONCodec, NatsConnection } from "nats";

const eventEmitter = new EventEmitter();

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

const jc = JSONCodec();
let nc: NatsConnection;

export const init = async () => {
  nc = await connect({ servers: [NATS] });

  handleNewStreamEvent();
};

type Events = "new-stream";

export const on = (event: Events, handler: any) => {
  eventEmitter.on(event, handler);
};

const handleNewStreamEvent = async () => {
  const sub = nc.subscribe("stream.created");

  for await (const msg of sub) {
    const data = jc.decode(msg.data);
    eventEmitter.emit("new-stream", data);
  }
};
