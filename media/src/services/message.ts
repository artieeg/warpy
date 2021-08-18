import { IConnectTransport, IMessage } from "@media/models";
import { NodeInfo } from "@media/nodeinfo";
import { role } from "@media/role";
import {
  IConnectMediaServer,
  IConnectNewSpeakerMedia,
  ICreateMediaRoom,
  IJoinMediaRoom,
  INewMediaTrack,
  INewProducer,
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

const initProducerFunctions = () => {
  handleNewTrack();
  handleNewSpeaker();
  handleNewEgress();
};

const initCommonFunctions = () => {
  handleCreateNewRoom();
  handleConnectTransport();
  handleJoinRoom();
};

const initConsumerFunctions = () => {
  handleRecvTracksRequest();
  handleNewProducerFromIngress();
};

export const init = async () => {
  nc = await connect({ servers: [NATS] });

  initCommonFunctions();

  if (role === "PRODUCER" || role === "BOTH") {
    initProducerFunctions();
  }

  if (role === "CONSUMER" || role === "BOTH") {
    initConsumerFunctions();
  }
};

export const handleNewEgress = async () => {
  const sub = nc.subscribe(subjects.media.egress.tryConnect);

  for await (const msg of sub) {
    const data = jc.decode(msg.data) as any;

    const event: IConnectMediaServer = {
      node: data.node,
      ip: data.ip,
      port: data.port,
      srtp: data.srtp,
    };

    eventEmitter.emit("new-egress", event, (response: IConnectMediaServer) => {
      msg.respond(jc.encode(response));
    });
  }
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
  const sub = nc.subscribe(`${subjects.media.track.getRecv}.${NodeInfo.id}`);

  for await (const msg of sub) {
    const data = jc.decode(msg.data) as IRecvTracksRequest;

    eventEmitter.emit("recv-tracks-request", data, (d: any) => {
      msg.respond(jc.encode(d));
    });
  }
};

export const handleJoinRoom = async () => {
  const subject =
    role === "PRODUCER"
      ? `${subjects.media.peer.join}.*`
      : `${subjects.media.peer.join}.${NodeInfo.id}`;

  const sub = nc.subscribe(subject);

  for await (const msg of sub) {
    const data = jc.decode(msg.data) as any;

    const event: IJoinMediaRoom = {
      user: data.user,
      roomId: data.roomId,
    };

    eventEmitter.emit("join-room", event, (d: any) => {
      msg.respond(jc.encode(d));
    });
  }
};

export const handleConnectTransport = async () => {
  const subject =
    process.env.ROLE === "PRODUCER"
      ? subjects.media.transport.connect_producer
      : subjects.media.transport.connect_consumer + "." + NodeInfo.id;

  const sub = nc.subscribe(subject);

  for await (const msg of sub) {
    const transport: IConnectTransport = jc.decode(msg.data) as any;
    eventEmitter.emit("connect-transport", transport);
  }
};

export const handleNewTrack = async () => {
  const sub = nc.subscribe(subjects.media.track.send);

  for await (const msg of sub) {
    const newTrack: INewMediaTrack = jc.decode(msg.data) as any;
    console.log("new trac", newTrack);
    eventEmitter.emit("new-track", newTrack);
  }
};

export const handleCreateNewRoom = async () => {
  const sub = nc.subscribe(subjects.media.room.create, {
    queue: process.env.ROLE,
  });

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
  | "new-egress"
  | "new-producer"
  | "recv-tracks-request";

export const on = (event: Event, handler: MessageHandler<any, any>) => {
  eventEmitter.on(event, handler);
};

export const tryConnectToIngress = async (
  options: IConnectMediaServer
): Promise<IConnectMediaServer> => {
  const response = await nc.request(
    subjects.media.egress.tryConnect,
    jc.encode(options)
  );

  return jc.decode(response.data) as IConnectMediaServer;
};

export const sendActiveSpeakers = (speakers: string[]) => {
  nc.publish("stream.active-speakers", jc.encode({ speakers }));
};

export const sendNewProducer = (node: string, producer: INewProducer) => {
  nc.publish(
    `${subjects.media.egress.newProducer}.${node}`,
    jc.encode(producer)
  );
};

export const handleNewProducerFromIngress = async () => {
  const sub = nc.subscribe(
    `${subjects.media.egress.newProducer}.${NodeInfo.id}`
  );

  for await (const msg of sub) {
    const newProducer: INewProducer = jc.decode(msg.data) as any;
    eventEmitter.emit("new-producer", newProducer);
  }
};

export const sendNodeIsOnlineMessage = async (nodeParams: any) => {
  const data = jc.encode(nodeParams);
  nc.publish(subjects.media.node.isOnline, data);
};
