import { MediaKind } from "mediasoup-client/lib/types";
import { runner } from "../useStore";
import { StoreSlice } from "../types";
import { MediaService } from "../app/media";

export interface IMediaDispatchers {
  dispatchAudioToggle: () => Promise<void>;
  dispatchVideoToggle: () => Promise<void>;
  dispatchCameraSwitch: () => void;
  dispatchTrackAdd: (user: string, consumerParameters: any) => Promise<void>;
  dispatchMediaRequest: (
    kind: MediaKind,
    params?: { enabled?: boolean }
  ) => Promise<void>;
  dispatchMediaClose: () => Promise<void>;
}

export const createMediaDispatchers: StoreSlice<IMediaDispatchers> = (
  _set,
  get
) => ({
  async dispatchTrackAdd(user, consumerParameters) {
    await runner.mergeStateUpdate(
      new MediaService(get()).consumeRemoteStream({
        user,
        consumerParameters,
      })
    );
  },

  async dispatchMediaClose() {
    await runner.mergeStateUpdate(new MediaService(get()).close());
  },

  async dispatchMediaRequest(kind, params) {
    await runner.mergeStateUpdate(
      new MediaService(get()).requestMediaStream(kind, params)
    );
  },

  dispatchCameraSwitch() {
    new MediaService(get()).switchCamera();
  },

  async dispatchAudioToggle() {
    await runner.mergeStateUpdate(new MediaService(get()).toggleAudio());
  },

  async dispatchVideoToggle() {
    await runner.mergeStateUpdate(new MediaService(get()).toggleVideo());
  },
});
