import { IConnectTransport, IMessage } from "@video/models";
import {
  IConnectNewSpeakerMedia,
  ICreateMediaRoom,
  IJoinMediaRoom,
  INewMediaTrack,
  IRecvTracksRequest,
  MessageHandler,
  subjects,
} from "@warpy/lib";
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
  handleNewSpeaker();
};

export const handleNewSpeaker = async () => {
  const sub = nc.subscribe(subjects.media.peer.makeSpeaker);

  for await (const msg of sub) {
    const data = jc.decode(msg.data) as any;

    const event: IConnectNewSpeakerMedia = {
      speaker: data.speaker,
      roomId: data.roomId,
    };

    eventEmitter.emit("new-speaker", event, (response: any) => {
      msg.respond(jc.encode(response));
    });
  }
};

export const handleRecvTracksRequest = async () => {
  const sub = nc.subscribe(subjects.media.track.getRecv);

  for await (const msg of sub) {
    const data = jc.decode(msg.data) as any;

    const event: IRecvTracksRequest = {
      user: data.user,
      roomId: data.roomId,
      rtpCapabilities: data.rtpCapabilities,
    };

    eventEmitter.emit("recv-tracks-request", event, (d: any) => {
      msg.respond(jc.encode(d));
    });
  }
};

export const handleJoinRoom = async () => {
  const sub = nc.subscribe(subjects.media.peer.join);

  for await (const msg of sub) {
    const data = jc.decode(msg.data) as any;

    const event: IJoinMediaRoom = {
      user: data.user,
      roomId: data.roomId,
    };

    eventEmitter.emit("join-room", event);
  }
};

export const handleConnectTransport = async () => {
  const sub = nc.subscribe(subjects.media.transport.connect);

  for await (const msg of sub) {
    const transport: IConnectTransport = jc.decode(msg.data) as any;
    eventEmitter.emit("connect-transport", transport);
  }
};

export const handleNewTrack = async () => {
  const sub = nc.subscribe(subjects.media.track.send);

  for await (const msg of sub) {
    const newTrack: INewMediaTrack = jc.decode(msg.data) as any;
    eventEmitter.emit("new-track", newTrack);
  }
};

export const handleCreateNewRoom = async () => {
  const sub = nc.subscribe(subjects.media.room.create);

  for await (const msg of sub) {
    const payload = jc.decode(msg.data) as any;
    const { host, roomId } = payload;

    const data: ICreateMediaRoom = {
      host,
      roomId,
    };

    eventEmitter.emit("create-room", data, (d: any) => {
      msg.respond(jc.encode(d));
    });
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
  | "new-speaker"
  | "recv-tracks-request";

export const on = (event: Event, handler: MessageHandler<any, any>) => {
  eventEmitter.on(event, handler);
};
