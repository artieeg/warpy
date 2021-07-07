import { EventEmitter } from "events";
import { connect, JSONCodec, NatsConnection } from "nats";
import { IParticipant, IStream } from "@app/models";

const eventEmitter = new EventEmitter();

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;
const jc = JSONCodec();

export const init = async () => {
  nc = await connect({ servers: [NATS] });

  handleNewStream();
  handleStreamEnd();
  handleStreamJoin();
  handleStreamLeave();
};

type Events =
  | "conversation-new"
  | "conversation-end"
  | "participant-new"
  | "participant-leave";

export const on = (event: Events, handler: any) => {
  eventEmitter.on(event, handler);
};

const handleStreamLeave = async () => {
  const sub = nc.subscribe("stream.user.leave");

  for await (const msg of sub) {
    const { id } = jc.decode(msg.data) as any;

    eventEmitter.emit("participant-leave", id);
  }
};

const handleStreamJoin = async () => {
  const sub = nc.subscribe("stream.user.join");

  for await (const msg of sub) {
    const { id, stream } = jc.decode(msg.data) as any;

    const participant: IParticipant = {
      id,
      stream,
    };

    eventEmitter.emit("participant-new", participant);
  }
};

const handleStreamEnd = async () => {
  const sub = nc.subscribe("stream.ended");

  for await (const msg of sub) {
    const { id } = jc.decode(msg.data) as any;

    eventEmitter.emit("conversation-end", id);
  }
};

const handleNewStream = async () => {
  const sub = nc.subscribe("stream.created");

  for await (const msg of sub) {
    const message = jc.decode(msg.data) as any;

    const newStream: IStream = {
      id: message.id,
      owner: message.owner,
    };

    eventEmitter.emit("new-conversation", newStream);
  }
};

export const sendMessageBroadcast = async (users: string[], message: any) => {};
