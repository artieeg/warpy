import {
  IConnectTransport,
  ICreateNewRoom,
  IJoinRoom,
  IMessage,
  INewTrack,
  IRecvTracksRequest,
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
  handleConnectTransport();
  handleJoinRoom();
  handleRecvTracksRequest();
};

export const handleRecvTracksRequest = async () => {
  const sub = nc.subscribe("video.track.recv.get");

  for await (const msg of sub) {
    const data = jc.decode(msg.data) as any;

    const event: IRecvTracksRequest = {
      user: data.user,
      roomId: data.stream,
      rtpCapabilities: data.rtpCapabilities,
    };

    eventEmitter.emit("recv-tracks-request", event);
  }
};

export const handleJoinRoom = async () => {
  const sub = nc.subscribe("stream.user.join");

  for await (const msg of sub) {
    const data = jc.decode(msg.data) as any;
    console.log("join room handler received", data);

    const event: IJoinRoom = {
      user: data.user,
      roomId: data.stream,
    };

    eventEmitter.emit("join-room", event);
  }
};

export const handleConnectTransport = async () => {
  const sub = nc.subscribe("video.transport.connect");

  for await (const msg of sub) {
    const transport: IConnectTransport = jc.decode(msg.data) as any;
    eventEmitter.emit("connect-transport", transport);
  }
};

export const handleNewTrack = async () => {
  const sub = nc.subscribe("video.track.new");

  for await (const msg of sub) {
    const newTrack: INewTrack = jc.decode(msg.data) as any;
    console.log("new track", newTrack);
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
  nc.publish(`reply.user.${user}`, jc.encode(message));
};

type Event =
  | "create-room"
  | "new-track"
  | "connect-transport"
  | "join-room"
  | "recv-tracks-request";

export const on = (event: Event, handler: any) => {
  eventEmitter.on(event, handler);
};
