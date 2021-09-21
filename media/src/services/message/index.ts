import { IMessage } from "@media/models";
import { role } from "@media/role";
import {
  IConnectMediaServer,
  INewProducer,
  IRecordRequest,
  MessageHandler,
  subjects,
} from "@warpy/lib";
import EventEmitter from "events";
import { connect, JSONCodec, NatsConnection } from "nats";
import {
  SubjectEventMap,
  ProducerSubjectEventMap,
  ConsumerSubjectEventMap,
} from "./subjects";
import { CommonSubjectEventMap } from "./subjects/common";

const eventEmitter = new EventEmitter();

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

const jc = JSONCodec();
let nc: NatsConnection;

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

const initCommonFunctions = () => {
  Object.keys(CommonSubjectEventMap).forEach((subject) =>
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

  initCommonFunctions();
};

export const sendMessageToUser = (user: string, message: IMessage) => {
  nc.publish(`reply.user.${user}`, jc.encode(message));
};

type EventMap = typeof SubjectEventMap;

type Event = EventMap[keyof EventMap];

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

export const sendRecordRequest = async (params: IRecordRequest) => {
  nc.publish("stream.record-request", jc.encode(params));
};
