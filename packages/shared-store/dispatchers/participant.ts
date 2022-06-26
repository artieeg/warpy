import { IParticipant } from "@warpy/lib";
import { StoreDispatcherSlice } from "../types";

export interface IParticipantDispatchers {
  dispatchViewersFetch: () => Promise<void>;
  dispatchParticipantAdd: (viewer: IParticipant) => void;
  dispatchStreamerAdd: (streamer: IParticipant) => void;
  dispatchParticipantRaisedHand: (user: IParticipant) => void;
  dispatchParticipantRemove: (user: string) => void;
  dispatchMediaToggle: (
    user: string,
    data: { video?: boolean; audio?: boolean }
  ) => void;
}

export const createParticipantDispatchers: StoreDispatcherSlice<IParticipantDispatchers> =
  (runner, { stream, media }) => ({
    dispatchStreamerAdd(user) {
      runner.mergeStateUpdate(stream.addStreamParticipant(user));
    },

    async dispatchViewersFetch() {
      await runner.mergeStreamedUpdates(stream.fetchStreamViewers());
    },

    dispatchParticipantRemove(user) {
      runner.mergeStateUpdate(stream.removeStreamParticipant(user));
    },

    dispatchParticipantRaisedHand(user) {
      runner.mergeStateUpdate(stream.updateStreamParticipant(user));
    },

    dispatchParticipantAdd(user) {
      runner.mergeStateUpdate(stream.addStreamParticipant(user));
    },

    dispatchMediaToggle(user, { video, audio }) {
      runner.mergeStateUpdate(
        media.toggleParticipantMedia(user, { video, audio })
      );
    },
  });
