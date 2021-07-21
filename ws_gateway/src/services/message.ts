import { connect, JSONCodec, NatsConnection } from "nats";
import { subjects } from "@warpy/lib";

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;
const jc = JSONCodec();

export const init = async () => {
  nc = await connect({ servers: [NATS] });
};

export const sendTransportConnect = (data: any, isProducer: boolean) => {
  nc.publish(
    isProducer
      ? subjects.media.transport.connect_producer
      : subjects.media.transport.connect_consumer,
    jc.encode(data)
  );
};

export const sendNewTrackEvent = (data: any) => {
  nc.publish(subjects.conversations.track.try_send, jc.encode(data));
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

export const sendRecvTracksRequest = (data: any) => {
  const payload = jc.encode(data);

  nc.publish(subjects.conversations.track.try_get, payload);
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
