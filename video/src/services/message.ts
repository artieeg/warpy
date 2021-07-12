import { ICreateNewRoom } from "@app/models";
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
};

export const handleCreateNewRoom = async () => {
  const sub = nc.subscribe("stream.created");

  for await (const msg of sub) {
    const newStream = jc.decode(msg.data) as any;

    const host = newStream.owner;
    const roomId = newStream.id;

    const data: ICreateNewRoom = {
      host,
      roomId,
    };

    eventEmitter.emit("create-room", data);
  }
};

type Event = "create-room";

export const on = (event: Event, handler: any) => {
  eventEmitter.on(event, handler);
};
