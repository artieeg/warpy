import { EventEmitter } from "events";
import { connect, JSONCodec, NatsConnection } from "nats";
import {
  IConnectMediaTransport,
  IConnectNewSpeakerMedia,
  ICreateMediaRoom,
  IJoinMediaRoom,
  INewMediaRoomData,
  INewMediaTrack,
  INewSpeakerMediaResponse,
  IRecvTracksRequest,
  IRecvTracksResponse,
  MessageHandler,
  subjects,
} from "@warpy/lib";

const eventEmitter = new EventEmitter();

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;
const jc = JSONCodec();

const SubjectEventMap = {
  "stream.stop": "stream-stop",
  "user.disconnected": "user-disconnected",
  "stream.create": "stream-new",
  "user.whoami-request": "whoami-request",
  "feeds.get": "feed-request",
  "viewers.get": "viewers-request",
  "stream.join": "user-joins-stream",
  "user.raise-hand": "raise-hand",
  "speaker.allow": "speaker-allow",
  "user.create": "new-user",
  "media.node.is-online": "new-media-node",
  "stream.active-speakers": "active-speakers",
};

type Subject = keyof typeof SubjectEventMap;

const subscribeTo = async (subject: Subject) => {
  const sub = nc.subscribe(subject);

  for await (const msg of sub) {
    const message = jc.decode(msg.data) as any;
    eventEmitter.emit(SubjectEventMap[subject], message, (response: any) => {
      msg.respond(jc.encode(response));
    });
  }
};

export const handleMessages = () => {
  Object.keys(SubjectEventMap).forEach((key) => {
    subscribeTo(key as Subject);
  });
};

export const init = async () => {
  nc = await connect({ servers: [NATS] });

  handleMessages();
};

type Events = typeof SubjectEventMap[Subject];

export const on = (event: Events, handler: MessageHandler<any, any>) => {
  eventEmitter.on(event, handler);
};

const _sendMessage = async (user: string, message: Uint8Array) => {
  nc.publish(`reply.user.${user}`, message);
};

export const sendMessage = async (user: string, message: any) => {
  _sendMessage(user, jc.encode(message));
};

export const sendMessageBroadcast = async (users: string[], message: any) => {
  const encodedMessage = jc.encode(message);

  users.forEach((user) => _sendMessage(user, encodedMessage));
};

export const createMediaRoom = async (
  data: ICreateMediaRoom
): Promise<INewMediaRoomData> => {
  const m = jc.encode(data);

  const reply = await nc.request(subjects.media.room.create, m, {
    timeout: 1000,
  });

  return jc.decode(reply.data) as INewMediaRoomData;
};

export const getRecvTracks = async (
  node: string,
  data: IRecvTracksRequest
): Promise<IRecvTracksResponse> => {
  const m = jc.encode(data);

  const reply = await nc.request(`${subjects.media.track.getRecv}.${node}`, m, {
    timeout: 1000,
  });

  return jc.decode(reply.data) as IRecvTracksResponse;
};

export const connectSpeakerMedia = async (
  data: IConnectNewSpeakerMedia
): Promise<INewSpeakerMediaResponse> => {
  const m = jc.encode(data);

  const reply = await nc.request(subjects.media.peer.makeSpeaker, m, {
    timeout: 1000,
  });

  return jc.decode(reply.data) as INewSpeakerMediaResponse;
};

export const sendConnectTransport = async (
  node: string,
  data: IConnectMediaTransport
) => {
  nc.publish(
    data.direction === "send"
      ? subjects.media.transport.connect_producer
      : `${subjects.media.transport.connect_consumer}.${node}`,
    jc.encode(data)
  );
};

export const sendNewTrack = async (data: INewMediaTrack) => {
  const m = jc.encode(data);

  nc.publish(subjects.media.track.send, m);
};

export const joinMediaRoom = async (node: string, data: IJoinMediaRoom) => {
  const m = jc.encode(data);

  nc.publish(`${subjects.media.peer.join}.${node}`, m);
};
