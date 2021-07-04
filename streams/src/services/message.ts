import { connect, NatsConnection, StringCodec } from "nats";
import { IStream } from "@app/models";

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;

export const init = async () => {
  nc = await connect({ servers: [NATS] });
};

export const sendNewStreamEvent = async (stream: IStream) => {
  const sc = StringCodec();
  const payload = sc.encode(JSON.stringify(stream));

  nc.publish("stream.created", payload);
};

export const sendStreamEndedEvent = async (streamId: string) => {};

export const sendStreamTitleChangeEvent = async (
  id: string,
  title: string
) => {};
