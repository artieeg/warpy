import { EventEmitter } from "events";
import { connect, JSONCodec, NatsConnection } from "nats";
import {
  IConnectMediaTransport,
  IConnectNewSpeakerMedia,
  ICreateMediaRoom,
  IJoinMediaRoom,
  IKickedFromMediaRoom,
  INewMediaRoomData,
  INewMediaTrack,
  INewSpeakerMediaResponse,
  IRecvTracksRequest,
  IRecvTracksResponse,
  MessageHandler,
  subjects,
} from "@warpy/lib";

const eventEmitter = new EventEmitter();

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
  "user.delete": "user-delete",
  "stream.new-preview": "new-stream-preview",
  "stream.reaction": "reaction",
  "user.follow": "user-follow",
  "user.unfollow": "user-unfollow",
  "stream.new-chat-message": "new-chat-message",
  "stream.kick-user": "kick-user",
  "user.report": "report-user",
};

export type Subject = keyof typeof SubjectEventMap;
export type Event = typeof SubjectEventMap[Subject];

const subscribeTo = async (subject: Subject) => {
  const sub = nc.subscribe(subject);

  for await (const msg of sub) {
    const message = jc.decode(msg.data);
    eventEmitter.emit(
      SubjectEventMap[subject],
      message,
      (response: unknown) => {
        msg.respond(jc.encode(response));
      }
    );
  }
};

export const handleMessages = (): void => {
  Object.keys(SubjectEventMap).forEach((key) => {
    subscribeTo(key as Subject);
  });
};

const _sendMessage = async (user: string, message: Uint8Array) => {
  nc.publish(`reply.user.${user}`, message);
};

export const MessageService = {
  async init(): Promise<void> {
    const NATS = process.env.NATS_ADDR;
    if (!NATS) {
      throw new Error("No nats addr specified");
    }

    nc = await connect({ servers: [NATS] });

    handleMessages();
  },

  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  on(event: string, handler: MessageHandler<any, any>): void {
    eventEmitter.on(event, (data: any, respond: any) => {
      try {
        handler(data, respond);
      } catch (e) {
        console.error(e);
      }
    });
  },

  async sendMessage(user: string, message: unknown): Promise<void> {
    _sendMessage(user, jc.encode(message));
  },

  async sendMessageBroadcast(users: string[], message: unknown): Promise<void> {
    const encodedMessage = jc.encode(message);

    users.forEach((user) => _sendMessage(user, encodedMessage));
  },

  async createMediaRoom(data: ICreateMediaRoom): Promise<INewMediaRoomData> {
    const m = jc.encode(data);

    const reply = await nc.request(subjects.media.room.create, m, {
      timeout: 60000,
    });

    return jc.decode(reply.data) as INewMediaRoomData;
  },

  async getRecvTracks(
    node: string,
    data: IRecvTracksRequest
  ): Promise<IRecvTracksResponse> {
    const m = jc.encode(data);

    const reply = await nc.request(
      `${subjects.media.track.getRecv}.${node}`,
      m,
      {
        timeout: 60000,
      }
    );

    return jc.decode(reply.data) as IRecvTracksResponse;
  },

  async connectSpeakerMedia(
    data: IConnectNewSpeakerMedia
  ): Promise<INewSpeakerMediaResponse> {
    const m = jc.encode(data);

    const reply = await nc.request(subjects.media.peer.makeSpeaker, m, {
      timeout: 60000,
    });

    return jc.decode(reply.data) as INewSpeakerMediaResponse;
  },

  async sendConnectTransport(
    node: string,
    data: IConnectMediaTransport
  ): Promise<void> {
    nc.publish(
      data.direction === "send"
        ? subjects.media.transport.connect_producer
        : `${subjects.media.transport.connect_consumer}.${node}`,
      jc.encode(data)
    );
  },

  async sendNewTrack(data: INewMediaTrack): Promise<void> {
    const m = jc.encode(data);

    nc.publish(subjects.media.track.send, m);
  },

  async kickUser(
    node: string,
    stream: string,
    user: string
  ): Promise<IKickedFromMediaRoom> {
    const m = jc.encode({
      user,
      stream,
    });

    const response = await nc.request(`media.peer.kick-user.${node}`, m, {
      timeout: 5000,
    });

    return jc.decode(response.data) as IKickedFromMediaRoom;
  },

  async joinMediaRoom(node: string, data: IJoinMediaRoom): Promise<unknown> {
    const m = jc.encode(data);

    const response = await nc.request(
      `${subjects.media.peer.join}.${node}`,
      m,
      {
        timeout: 60000,
      }
    );
    return jc.decode(response.data);
  },
};
