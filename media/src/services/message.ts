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

const connectRecvTransportSubject = `media.transport.connect.consumer.${NodeInfo.id}`;
const consumerJoinRoomSubject = `media.peer.join.${NodeInfo.id}`;
const producerJoinRoomSubject = `media.peer.join.*`;

const recvTracksRequestSubject = `media.track.recv.get.${NodeInfo.id}`;
const newProducerSubject = `media.egress.new-producer.${NodeInfo.id}`;

const ConsumerSubjectEventMap = {
  "media.room.create": "create-room",
  [connectRecvTransportSubject]: "connect-transport",
  [consumerJoinRoomSubject]: "join-room",
  [recvTracksRequestSubject]: "recv-tracks-request",
  [newProducerSubject]: "new-producer",
};

const ProducerSubjectEventMap = {
  "media.track.send": "new-track",
  "media.room.create": "create-room",
  "media.peer.make-speaker": "new-speaker",
  "media.egress.try-connect": "new-egress",
  "media.transport.connect.producer": "connect-transport",
  [producerJoinRoomSubject]: "join-room",
};

const SubjectEventMap = {
  ...ConsumerSubjectEventMap,
  ...ProducerSubjectEventMap,
};

const subscribeTo = async (subject: any) => {
  const sub = nc.subscribe(subject);

  for await (const msg of sub) {
    const message = jc.decode(msg.data) as any;
    const event = (SubjectEventMap as any)[subject];
    eventEmitter.emit(event, message, (response: any) => {
      msg.respond(jc.encode(response));
    });
  }
};

const initProducerFunctions = () => {
  Object.keys(ProducerSubjectEventMap).forEach((subject) =>
    subscribeTo(subject as any)
  );
};

const initConsumerFunctions = () => {
  Object.keys(ConsumerSubjectEventMap).forEach((subject) =>
    subscribeTo(subject as any)
  );
};

export const init = async () => {
  nc = await connect({ servers: [NATS] });

  if (role === "PRODUCER") {
    initProducerFunctions();
  }

  if (role === "CONSUMER") {
    initConsumerFunctions();
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

export const sendNodeIsOnlineMessage = async (nodeParams: any) => {
  const data = jc.encode(nodeParams);
  nc.publish(subjects.media.node.isOnline, data);
};
