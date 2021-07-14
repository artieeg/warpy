import {
  IConnectTransport,
  ICreateNewRoom,
  IMessage,
  INewTrack,
} from "@app/models";
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

  handleCreateNewRoom();
  handleNewTrack();
};

export const handleConnectTransport = async () => {
  const sub = nc.subscribe("video.transport.connect");

  for await (const msg of sub) {
    const newTrack: IConnectTransport = jc.decode(msg.data) as any;
    eventEmitter.emit("connect-transport", newTrack);
  }
};

export const handleNewTrack = async () => {
  const sub = nc.subscribe("video.track.new");

  for await (const msg of sub) {
    const newTrack: INewTrack = jc.decode(msg.data) as any;
    eventEmitter.emit("new-track", newTrack);
  }
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

export const sendMessageToUser = (user: string, message: IMessage) => {
  console.log(`sending ${JSON.stringify(message)} to ${user}`);
  nc.publish(`reply.user.${user}`, jc.encode(message));
};

type Event = "create-room" | "send-track" | "connect-transport";

export const on = (event: Event, handler: any) => {
  eventEmitter.on(event, handler);
};
