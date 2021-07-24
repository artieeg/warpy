import { connect, NatsConnection } from "nats";

let nc: NatsConnection;
export const init = async (nats: string[]) => {
  nc = await connect({ servers: nats });
};
