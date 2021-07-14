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

export const sendTransportConnect = (data: any) => {
  nc.publish("video.transport.connect", jc.encode(data));
};

export const sendNewTrackEvent = (data: any) => {
  nc.publish("video.track.new", jc.encode(data));
};

export const sendUserJoinEvent = (data: any) => {
  nc.publish("stream.user.join", jc.encode(data));
};

export const sendUserLeaveEvent = (user: string) => {};

export const sendUserDisconnectEvent = (user: string) => {};

export const sendSpeakerAllowEvent = (data: any) => {
  const payload = jc.encode(data);

  nc.publish("speaker.allow", payload);
};

export const sendUserRaiseHandEvent = (user: string) => {
  const payload = jc.encode({ id: user });

  nc.publish("user.raise-hand", payload);
};

export const subscribeForEvents = async (user: string, callback: any) => {
  console.log(`subbign for reply.user.${user}`);

  const sub = nc.subscribe(`reply.user.${user}`);

  //const listen = new Promise<void>(async (resolve) => {
  for await (const msg of sub) {
    const data = jc.decode(msg.data) as any;
    console.log("received a reply", data);
    callback(data);
  }

  //resolve();
  //});

  //return [sub, listen];
};
