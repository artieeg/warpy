import { EventEmitter } from "events";
import { MessageHandler } from "@warpy/lib";
import { connect, JSONCodec, NatsConnection } from "nats";

const eventEmitter = new EventEmitter();

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;
const jc = JSONCodec();

const SubjectEventMap = {
  "stream.record-request": "record-request",
};

type Subject = keyof typeof SubjectEventMap;
type Events = typeof SubjectEventMap[Subject];

export const onMessage = (event: Events, handler: MessageHandler<any, any>) => {
  eventEmitter.on(event, handler);
};

const subscribeTo = async (subject: Subject) => {
  const sub = nc.subscribe(subject);

  for await (const msg of sub) {
    const message = jc.decode(msg.data) as any;
    eventEmitter.emit(SubjectEventMap[subject], message, (response: any) => {
      msg.respond(jc.encode(response));
    });
  }
};

export const initMessageService = async () => {
  nc = await connect({ servers: [NATS] });

  Object.keys(SubjectEventMap).forEach((key) => {
    subscribeTo(key as Subject);
  });
};

export const sendNewPreview = async (stream: string, preview: string) => {
  nc.publish(
    "stream.new-preview",
    jc.encode({
      stream,
      preview,
    })
  );
};
