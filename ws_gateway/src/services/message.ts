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

export const subscribeForEvents = async (
  user: string,
  callback: any
): Promise<[any, Promise<void>]> => {
  const sub = nc.subscribe(`reply.user.${user}`);

  const listen = new Promise<void>(async (resolve) => {
    for await (const msg of sub) {
      const data = jc.decode(msg.data) as any;
      callback(data);
    }

    resolve();
  });

  return [sub, listen];
};
