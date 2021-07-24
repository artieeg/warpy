import { EventEmitter } from "events";
import { connect, JSONCodec, NatsConnection } from "nats";
import {
  IAllowSpeakerPayload,
  IParticipant,
  IRequestGetTracks,
  IStream,
} from "@conv/models";
import {
  IConnectMediaTransport,
  IConnectNewSpeakerMedia,
  ICreateMediaRoom,
  IJoinMediaRoom,
  INewMediaNode,
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

export const init = async () => {
  nc = await connect({ servers: [NATS] });

  handleNewMediaNode();
  handleNewStream();
  handleStreamEnd();
  handleStreamJoin();
  handleStreamLeave();
  handleAllowSpeaker();
  handleRaisedHand();
  handleNewTrack();
  handleRecvTracksRequest();
  handleConnectTransport();
};

type Events =
  | "conversation-new"
  | "recv-tracks-request"
  | "conversation-end"
  | "participant-new"
  | "speaker-allow"
  | "raise-hand"
  | "new-track"
  | "connect-transport"
  | "new-media-node"
  | "participant-leave";

export const on = (event: Events, handler: MessageHandler<any, any>) => {
  eventEmitter.on(event, handler);
};

const handleConnectTransport = async () => {
  const sub = nc.subscribe(subjects.conversations.transport.try_connect);

  for await (const msg of sub) {
    const { transportId, dtlsParameters, direction, roomId, user } = jc.decode(
      msg.data
    ) as any;

    const data: IConnectMediaTransport = {
      transportId,
      dtlsParameters,
      direction,
      roomId,
      user,
    };

    eventEmitter.emit("connect-transport", data);
  }
};

const handleNewTrack = async () => {
  const sub = nc.subscribe(subjects.conversations.track.try_send);

  for await (const msg of sub) {
    const {
      user,
      transportId,
      kind,
      rtpParameters,
      rtpCapabilities,
      paused,
      roomId,
      appData,
      direction,
    } = jc.decode(msg.data) as any;

    const data: INewMediaTrack = {
      user,
      transportId,
      kind,
      rtpParameters,
      rtpCapabilities,
      paused,
      roomId,
      appData,
      direction,
    };

    eventEmitter.emit("new-track", data);
  }
};

const handleRaisedHand = async () => {
  const sub = nc.subscribe("user.raise-hand");

  for await (const msg of sub) {
    const { id } = jc.decode(msg.data) as any;

    eventEmitter.emit("raise-hand", id);
  }
};

const handleStreamLeave = async () => {
  const sub = nc.subscribe("stream.user.leave");

  for await (const msg of sub) {
    const { id } = jc.decode(msg.data) as any;

    eventEmitter.emit("participant-leave", id);
  }
};

const handleAllowSpeaker = async () => {
  const sub = nc.subscribe("speaker.allow", { queue: "conversations" });

  for await (const msg of sub) {
    const { speaker, user } = jc.decode(msg.data) as any;

    eventEmitter.emit("speaker-allow", {
      speaker,
      user,
    } as IAllowSpeakerPayload);
  }
};

const handleStreamJoin = async () => {
  const sub = nc.subscribe("stream.user.join");

  for await (const msg of sub) {
    const { user, stream } = jc.decode(msg.data) as any;

    const participant: IParticipant = {
      id: user,
      stream,
    };

    eventEmitter.emit("participant-new", participant);
  }
};

const handleStreamEnd = async () => {
  const sub = nc.subscribe("stream.ended", { queue: "conversations" });

  for await (const msg of sub) {
    const { id } = jc.decode(msg.data) as any;

    eventEmitter.emit("conversation-end", id);
  }
};

const handleNewMediaNode = async () => {
  const sub = nc.subscribe(subjects.media.node.isOnline, {
    queue: "conversations",
  });

  for await (const msg of sub) {
    const message = jc.decode(msg.data) as any;

    const newStream: INewMediaNode = {
      id: message.id,
      role: message.role,
    };

    eventEmitter.emit("new-media-node", newStream);
  }
};

const handleNewStream = async () => {
  const sub = nc.subscribe("stream.created", { queue: "conversations" });

  for await (const msg of sub) {
    const message = jc.decode(msg.data) as any;

    const newStream: IStream = {
      id: message.id,
      owner: message.owner,
    };

    eventEmitter.emit("conversation-new", newStream);
  }
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
  data: IRecvTracksRequest
): Promise<IRecvTracksResponse> => {
  const m = jc.encode(data);

  const reply = await nc.request(subjects.media.track.getRecv, m, {
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
  console.log("connecting transport", data.direction);
  console.log("node", node);
  nc.publish(
    data.direction === "send"
      ? subjects.media.transport.connect_producer
      : `${subjects.media.transport.connect_consumer}.${node}`,
    jc.encode(data)
  );
};

export const sendNewTrack = async (data: INewMediaTrack) => {
  const m = jc.encode(data);

  console.log("sending new track");
  nc.publish(subjects.media.track.send, m);
};

export const joinMediaRoom = async (node: string, data: IJoinMediaRoom) => {
  console.log("joining node", node);
  const m = jc.encode(data);

  nc.publish(`${subjects.media.peer.join}.${node}`, m);
};

export const handleRecvTracksRequest = async () => {
  const sub = nc.subscribe(subjects.conversations.track.try_get);

  for await (const msg of sub) {
    const data = jc.decode(msg.data) as any;

    const event: IRequestGetTracks = {
      user: data.user,
      stream: data.stream,
      rtpCapabilities: data.rtpCapabilities,
    };

    eventEmitter.emit("recv-tracks-request", event, (d: any) => {
      msg.respond(jc.encode(d));
    });
  }
};
