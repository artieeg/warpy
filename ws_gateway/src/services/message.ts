import { connect, JSONCodec, NatsConnection } from "nats";

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;
const jc = JSONCodec();

export const init = async () => {
  nc = await connect({ servers: [NATS] });
};

export const sendUserJoinEvent = (user: string) => {};
export const sendUserLeaveEvent = (user: string) => {};
export const sendUserDisconnectEvent = (user: string) => {};
