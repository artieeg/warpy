import { connect, JSONCodec, NatsConnection, Subscription } from "nats";
import { IRecvTracksResponse, subjects } from "@warpy/lib";

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

export const BackendEvents = {
  "stream-stop": "stream.stop",
  "user-disconnected": "user.disconnected",
  "stream-new": "stream.create",
  "whoami-request": "user.whoami-request",
  "feed-request": "feeds.get",
  "request-viewers": "viewers.get",
  "join-stream": "stream.join",
  "raise-hand": "user.raise-hand",
  "new-user": "user.create",
  "new-track": "media.track.send",
  "delete-user": "user.delete",
  "user-follow": "user.follow",
  "user-unfollow": "user.unfollow",
  reaction: "stream.reaction",
  "new-chat-message": "stream.new-chat-message",
  "kick-user": "stream.kick-user",
  "report-user": "user.report",
  "block-user": "user.block",
};

type EventAlias = keyof typeof BackendEvents;

export const sendBackendMessage = (event: EventAlias, data: any) => {
  nc.publish(BackendEvents[event], jc.encode(data));
};

export const sendBackendRequest = async (
  event: EventAlias,
  data: any
): Promise<any> => {
  const response = await nc.request(BackendEvents[event], jc.encode(data), {
    timeout: 240000, //for debug purposes
  });

  return jc.decode(response.data) as any;
};

let nc: NatsConnection;
const jc = JSONCodec();

export const init = async () => {
  nc = await connect({ servers: [NATS] });
};

export const sendTransportConnect = (
  node: string,
  direction: string,
  data: any
) => {
  if (direction === "send") {
    nc.publish(subjects.media.transport.connect_producer, jc.encode(data));
  } else {
    nc.publish(
      `${subjects.media.transport.connect_consumer}.${node}`,
      jc.encode(data)
    );
  }
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

export const sendViewersRequest = (data: any) => {
  const payload = jc.encode(data);

  nc.publish("viewers.get", payload);
};

export const sendRecvTracksRequest = async (node: string, data: any) => {
  const m = jc.encode(data);

  const reply = await nc.request(`${subjects.media.track.getRecv}.${node}`, m, {
    timeout: 1000,
  });

  return jc.decode(reply.data) as IRecvTracksResponse;
};

export const subscribeForEvents = (
  user: string,
  callback: any
): [Subscription, () => Promise<any>] => {
  console.log(`subbign for reply.user.${user}`);

  const sub = nc.subscribe(`reply.user.${user}`);

  const listen = async () => {
    for await (const msg of sub) {
      const data = jc.decode(msg.data) as any;
      try {
        callback(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return [sub, listen];
};
