import EventEmitter from "events";
import { IUser } from "@app/models";
import { connect, JSONCodec, NatsConnection } from "nats";

const eventEmitter = new EventEmitter();

const jc = JSONCodec();
let nc: NatsConnection;

export const init = async () => {
  const NATS = process.env.NATS_ADDR || "127.0.0.1";
  nc = await connect({ servers: NATS });

  handleNewStreamEvent();
  handleStreamEndEvent();
};

type Events = "new-stream" | "stream-end";

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

const handleStreamEndEvent = async () => {
  const sub = nc.subscribe("stream.ended");

  for await (const msg of sub) {
    const data = jc.decode(msg.data);
    eventEmitter.emit("stream-end", data);
  }
};

export const getUser = async (id: string): Promise<IUser> => {
  const result = await nc.request("user.get", jc.encode({ id }));
  const data = jc.decode(result.data) as any;

  return {
    id: data.id,
    last_name: data.last_name,
    first_name: data.first_name,
    username: data.username,
    avatar: data.avatar,
  };
};
