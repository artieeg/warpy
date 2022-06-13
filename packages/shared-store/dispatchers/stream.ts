import { IParticipant } from "@warpy/lib";
import produce from "immer";
import { getStreamService } from "../app/stream";
import { MediaStreamMap } from "../slices/createMediaSlice";
import { StoreSlice } from "../types";
import { IStore } from "../useStore";

export function arrayToMap<T>(array: T[]) {
  const result: Record<string, T> = {};
  array.forEach((item) => {
    result[(item as any).id] = item;
  });

  return result;
}

export interface IStreamDispatchers {
  dispatchStreamCreate: () => Promise<void>;
  dispatchStreamJoin: (stream: string) => Promise<void>;
  dispatchStreamLeave: (config: {
    shouldStopStream?: boolean;
    stream?: string;
  }) => Promise<void>;
}

export const createStreamDispatchers: StoreSlice<IStreamDispatchers> = (
  set,
  get
) => ({
  async dispatchStreamLeave({ shouldStopStream, stream }) {
    const { api } = get();

    if (stream) {
      if (shouldStopStream) {
        await api.stream.stop(stream);
      } else {
        await api.stream.leave(stream);
      }
    }

    get().dispatchInviteClear();
    get().dispatchMediaClose();
  },

  async dispatchStreamCreate() {
    const {
      newStreamCategory,
      api,
      dispatchMediaSend,
      title,
      dispatchInitViewer,
      user,
    } = get();

    if (!title || !newStreamCategory) {
      return;
    }

    const {
      stream,
      media: mediaData,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    } = await api.stream.create(title, newStreamCategory.id);

    set({
      stream,
      title,
      sendMediaParams: mediaData,
      streamers: arrayToMap<IParticipant>([
        { ...user!, stream, role: "streamer", isBot: false, isBanned: false },
      ]),
      totalParticipantCount: count,
      currentStreamHost: user!.id,
      role: "streamer",
    });

    await dispatchInitViewer(mediaPermissionsToken, recvMediaParams);

    const recvTransport = await get().mediaClient!.createTransport({
      roomId: stream,
      device: get().recvDevice,
      direction: "recv",
      options: {
        recvTransportOptions: recvMediaParams.recvTransportOptions,
      },
      isProducer: false,
    });

    set({ recvTransport });

    await dispatchMediaSend(mediaPermissionsToken, ["audio", "video"], true);
  },

  async dispatchStreamJoin(stream) {
    const stateUpdate = await getStreamService(get()).join(stream);

    set(
      produce((state) => {
        for (const key in stateUpdate) {
          console.log({ key });
          state[key] = stateUpdate[key];
        }
      })
    );
  },
});
