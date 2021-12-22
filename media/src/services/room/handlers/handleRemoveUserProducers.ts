import { closePeerProducers } from "@media/models";
import { IRemoveUserProducersRequest, MessageHandler } from "@warpy/lib";
import { rooms } from "../rooms";

export const handleRemoveUserProducers: MessageHandler<IRemoveUserProducersRequest> =
  ({ user, producers, stream }) => {
    const { audio, video } = producers;

    const peer = rooms[stream].peers[user];

    closePeerProducers(peer, { audio, video });
  };
