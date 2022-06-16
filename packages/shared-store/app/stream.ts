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
      const initRecvMediaResult = await mediaService.initRecvMedia({
        stream,
        mediaPermissionsToken,
        recvMediaParams,
        streamers,
      });

      /** If not viewer, start sending media */
      let initSendMediaResult: StateUpdate = {};
      if (role !== "viewer") {
        initSendMediaResult = await mediaService.initSendMedia({
          token: mediaPermissionsToken,
          role,
          streamMediaImmediately: false,
        });
      }

      return {
        ...initSendMediaResult,
        ...initRecvMediaResult,
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
