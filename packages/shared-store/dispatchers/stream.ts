import { IParticipant, IParticipantWithMedia } from "@warpy/lib";
import { StoreSlice } from "../types";

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
    const { api, dispatchMediaSend, title, dispatchInitViewer } = get();

    if (!title) {
      return;
    }

    const {
      stream,
      media: mediaData,
      speakers,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    } = await api.stream.create(title, "60ec569668b42c003304630b");

    set({
      stream,
      title,
      sendMediaParams: mediaData,
      streamers: arrayToMap<IParticipant>(speakers),
      totalParticipantCount: count,
      isStreamOwner: true,
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

    set({
      stream,
      recvTransport,
      totalParticipantCount: count,
      streamers: arrayToMap<IParticipantWithMedia>(
        speakers.map((p) => {
          const audioConsumer = consumers.find(
            (c) => c.appData.user === p.id && c.kind === "audio"
          );

          const videoConsumer = consumers.find(
            (c) => c.appData.user === p.id && c.kind === "video"
          );

          return {
            ...p,
            media: {
              audio: audioConsumer && {
                consumer: audioConsumer,
                track: new MediaStream([audioConsumer.track]),
                active: p.audioEnabled || false,
              },
              video: videoConsumer && {
                consumer: videoConsumer,
                track: new MediaStream([videoConsumer.track]),
                active: p.videoEnabled || false,
              },
            },
          };
        })
      ),
      viewersWithRaisedHands: arrayToMap<IParticipant>(raisedHands),
      role: "viewer",
    });
  },
});
