import { connect, JSONCodec, NatsConnection } from "nats";
import { IStream } from "@app/models";

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;
const jc = JSONCodec();

export const init = async () => {
  nc = await connect({ servers: [NATS] });
};

export const sendNewStreamEvent = async (stream: IStream) => {
  const payload = jc.encode(stream);

  nc.publish("stream.created", payload);
};

export const sendStreamEndedEvent = async (streamId: string) => {
  const payload = jc.encode({ id: streamId });
  nc.publish("stream.ended", payload);
};

export const sendStreamTitleChangeEvent = async (
  id: string,
  title: string
) => {};
