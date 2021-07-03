import { connect, NatsConnection, StringCodec } from "nats";

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;

export const init = async () => {
  nc = await connect({ servers: [NATS] });
};
