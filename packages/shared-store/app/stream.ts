import { IParticipant } from "@warpy/lib";
import { arrayToMap } from "../dispatchers";
import { IStore } from "../useStore";
import { getMediaService } from "./media";
import { StateUpdate } from "./types";

export const getStreamService = (state: IStore) => {
  return {
    async join(stream: string): Promise<StateUpdate> {
      const { api } = state;

      const {
        mediaPermissionsToken,
        recvMediaParams,
        streamers,
        raisedHands,
        count,
        host,
        role,
        sendMediaParams,
      } = await api.stream.join(stream);

      const mediaService = getMediaService(state);

      /** Consume remote audio/video streams */
      const recvMediaStateUpdate = await mediaService.initRecvMedia({
        stream,
        mediaPermissionsToken,
        recvMediaParams,
        streamers,
      });

      /** If not viewer, start sending media */
      let sendMediaStateUpdate: StateUpdate = {};
      if (role !== "viewer") {
        sendMediaStateUpdate = await mediaService.initSendMedia(
          mediaPermissionsToken,
          role,
          false
        );
      }

      return {
        ...sendMediaStateUpdate,
        ...recvMediaStateUpdate,
        sendMediaParams,
        stream,
        currentStreamHost: host,
        totalParticipantCount: count,
        streamers: arrayToMap<IParticipant>(streamers),
        viewersWithRaisedHands: arrayToMap<IParticipant>(raisedHands),
        role,
      };
    },
  };
};
