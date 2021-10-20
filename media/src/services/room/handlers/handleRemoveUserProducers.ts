import { IRemoveUserProducersRequest, MessageHandler } from "@warpy/lib";
import { rooms } from "../rooms";

export const handleRemoveUserProducers: MessageHandler<IRemoveUserProducersRequest> =
  ({ user, producers, stream }) => {
    const { audio, video } = producers;

    const peer = rooms[stream].peers[user];

    if (audio) {
      console.log(`stopping peer ${user} audio producer at ${stream}`);
      peer.producer.audio?.close();
      peer.producer.audio = null;
    }

    if (video) {
      console.log(`stopping peer ${user} video producer at ${stream}`);
      peer.producer.video?.close();
      peer.producer.video = null;
    }
  };
