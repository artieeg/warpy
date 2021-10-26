import { MessageHandler } from "@warpy/lib";
import { rooms } from "../rooms";

export const handleKickedUser: MessageHandler<
  {
    user: string;
    stream: string;
  },
  { user: string; status: "ok" | "error" }
> = async (data, respond) => {
  const { user, stream } = data;

  const peer = rooms[stream].peers[user];

  if (!peer) {
    return respond({
      user,
      status: "error",
    });
  }

  peer.producer.video?.close();
  peer.producer.audio?.close();

  peer.recvTransport?.close();
  peer.sendTransport?.close();

  peer.consumers.forEach((consumer) => consumer.close());

  respond({
    user,
    status: "ok",
  });
};
