import { IMessage } from "@media/models";
import { NodeInfo } from "@media/nodeinfo";
import { role } from "@media/role";
import {
  RequestConnectMediaServer,
  RequestCreateProducer,
  RequestRecord,
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
  let event = (SubjectEventMap as any)[subject];
  let queue;

  if (typeof event === "object") {
    queue = event.queue;
    event = event.name;
  }

  const sub = nc.subscribe(subject, { queue });

  for await (const msg of sub) {
    const message = jc.decode(msg.data) as any;
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

export const send = (subject: string, data: any) => {
  nc.publish(subject, jc.encode(data));
};

export const sendMessageToUser = (user: string, message: IMessage) => {
  nc.publish(`reply.user.${user}`, jc.encode(message));
};

export const on = (event: string, handler: MessageHandler<any, any>) => {
  eventEmitter.on(event, handler);
};

export const tryConnectToIngress = async (
  options: RequestConnectMediaServer
): Promise<RequestConnectMediaServer> => {
  const response = await nc.request(
    subjects.media.egress.tryConnect,
    jc.encode(options)
  );

  return jc.decode(response.data) as RequestConnectMediaServer;
};

export const sendActiveSpeakers = (speakers: string[]) => {
  nc.publish("stream.active-speakers", jc.encode({ speakers }));
};

export const sendNewProducer = async (
  node: string,
  producer: RequestCreateProducer
) => {
  const r = await nc.request(
    `${subjects.media.egress.newProducer}.${node}`,
    jc.encode(producer)
  );
  return jc.decode(r.data) as any;
};

export const sendNodeIsOnlineMessage = async (nodeParams: any) => {
  const data = jc.encode(nodeParams);
  nc.publish(subjects.media.node.isOnline, data);
};

export const sendRecordRequest = async (params: RequestRecord) => {
  nc.publish("stream.record-request", jc.encode(params));
};

export const requestMediaTracks = async (stream: string) => {
  console.log("requesting media tracsk", { stream });
  const response = await nc.request(
    "media.node.egress.request-media",
    jc.encode({ stream, node: NodeInfo.id })
  );

  return jc.decode(response.data) as any;
};
