import { IParticipant } from "@warpy/lib";
import produce from "immer";
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
}

export const createStreamDispatchers: StoreSlice<IStreamDispatchers> = (
  set,
  get
) => ({
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
      speakers,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    } = await api.stream.create(title, newStreamCategory.id);

    set({
      stream,
      title,
      sendMediaParams: mediaData,
      streamers: arrayToMap<IParticipant>(speakers),
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
    const { api, dispatchInitViewer } = get();

    const {
      mediaPermissionsToken,
      recvMediaParams,
      speakers,
      raisedHands,
      count,
      host,
    } = await api.stream.join(stream);

    await dispatchInitViewer(mediaPermissionsToken, recvMediaParams);

    const mediaClient = get().mediaClient!;

    const recvTransport = await mediaClient?.createTransport({
      roomId: stream,
      device: get().recvDevice,
      direction: "recv",
      options: {
        recvTransportOptions: recvMediaParams.recvTransportOptions,
      },
      isProducer: false,
    });

    const consumers = await mediaClient.consumeRemoteStreams(
      stream,
      recvTransport
    );

    set(
      produce<IStore>((state) => {
        let audioStreams: MediaStreamMap = {};
        let videoStreams: MediaStreamMap = {};

        speakers.forEach((s) => {
          const audioConsumer = consumers.find(
            (c) => c.appData.user === s.id && c.kind === "audio"
          );

          const videoConsumer = consumers.find(
            (c) => c.appData.user === s.id && c.kind === "video"
          );

          if (audioConsumer) {
            audioStreams[s.id] = {
              consumer: audioConsumer,
              stream: new MediaStream([audioConsumer.track]),
              enabled: !!s.audioEnabled,
            };
          }

          if (videoConsumer) {
            videoStreams[s.id] = {
              consumer: videoConsumer,
              stream: new MediaStream([videoConsumer.track]),
              enabled: !!s.videoEnabled,
            };
          }
        });

        state.audioStreams = { ...state.audioStreams, ...audioStreams };
        state.videoStreams = { ...state.videoStreams, ...videoStreams };
      })
    );

    /*
    const audioTracks = speakers
      .map((p) => {
        const track = consumers.find(
          (c) => c.appData.user === p.id && c.kind === "audio"
        )?.track;

        if (!track || !p.audioEnabled) {
          return undefined;
        } else {
          return new MediaStream([track]);
        }
      })
      .filter((t) => !!t);

    const videoTracks = speakers
      .map((p) => {
        const track = consumers.find(
          (c) => c.appData.user === p.id && c.kind === "video"
        )?.track;

        if (!track || !p.videoEnabled) {
          return undefined;
        } else {
          return new MediaStream([track]);
        }
      })
      .filter((t) => !!t);
*/

    set({
      //audioTracks,
      //videoTracks,
      stream,
      currentStreamHost: host,
      recvTransport,
      totalParticipantCount: count,
      streamers: arrayToMap<IParticipant>(speakers),
      /*
      streamers: arrayToMap<IParticipant>(
        speakers.map((p) => {
          const videoConsumer = consumers.find(
            (c) => c.appData.user === p.id && c.kind === "video"
          );

          const audioConsumer = consumers.find(
            (c) => c.appData.user === p.id && c.kind === "audio"
          );

          return {
            ...p,
            media: {
              audio: audioConsumer
                ? {
                    consumer: audioConsumer,
                    track: new MediaStream([audioConsumer.track]),
                  }
                : null,
              video: videoConsumer
                ? {
                    consumer: videoConsumer,
                    track: new MediaStream([videoConsumer.track]),
                  }
                : null,
            },
          };
        })
      ),
      */
      viewersWithRaisedHands: arrayToMap<IParticipant>(raisedHands),
      role: "viewer",
    });
  },
});
