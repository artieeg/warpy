import { MediaKind } from "mediasoup-client/lib/types";
import { StoreDispatcherSlice } from "../types";

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

export const createMediaDispatchers: StoreDispatcherSlice<IMediaDispatchers> = (
  runner,
  { media }
) => ({
  async dispatchTrackAdd(user, consumerParameters) {
    await runner.mergeStateUpdate(
      media.consumeRemoteStream({
        user,
        consumerParameters,
      })
    );
  },

  async dispatchMediaClose() {
    await runner.mergeStateUpdate(media.close());
  },

  async dispatchMediaRequest(kind, params) {
    await runner.mergeStateUpdate(media.requestMediaStream(kind, params));
  },

  dispatchCameraSwitch() {
    media.switchCamera();
  },

  async dispatchAudioToggle() {
    await runner.mergeStateUpdate(media.toggleAudio());
  },

  async dispatchVideoToggle() {
    await runner.mergeStateUpdate(media.toggleVideo());
  },
});
