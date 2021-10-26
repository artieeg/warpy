import {IParticipant} from '@warpy/lib';
import {arrayToMap} from '@app/utils';
import {StoreSlice} from '../types';
import {IParticipantWithMedia} from '@app/types';

export interface IStreamDispatchers {
  dispatchStreamCreate: (title: string, hub: string) => Promise<void>;
  dispatchStreamJoin: (stream: string) => Promise<void>;
}

export const createStreamDispatchers: StoreSlice<IStreamDispatchers> = (
  set,
  get,
) => ({
  async dispatchStreamCreate(title, hub) {
    const {api, dispatchMediaSend, dispatchInitViewer} = get();

    const {
      stream,
      media: mediaData,
      speakers,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    } = await api.stream.create(title, hub);

    set({
      stream,
      title,
      sendMediaParams: mediaData,
      streamers: arrayToMap<IParticipant>(speakers),
      totalParticipantCount: count,
      isStreamOwner: true,
      role: 'streamer',
    });

    await dispatchInitViewer(mediaPermissionsToken, recvMediaParams);

    const recvTransport = await get().mediaClient!.createTransport({
      roomId: stream,
      device: get().recvDevice,
      direction: 'recv',
      options: {
        recvTransportOptions: recvMediaParams.recvTransportOptions,
      },
      isProducer: false,
    });

    set({recvTransport});

    await dispatchMediaSend(mediaPermissionsToken, ['audio', 'video']);
  },

  async dispatchStreamJoin(stream) {
    const {api, dispatchInitViewer} = get();

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
      direction: 'recv',
      options: {
        recvTransportOptions: recvMediaParams.recvTransportOptions,
      },
      isProducer: false,
    });

    const consumers = await mediaClient.consumeRemoteStreams(
      stream,
      recvTransport,
    );

    set({
      stream,
      recvTransport,
      totalParticipantCount: count,
      streamers: arrayToMap<IParticipantWithMedia>(
        speakers.map(p => {
          const audioConsumer = consumers.find(
            c => c.appData.user === p.id && c.kind === 'audio',
          );

          const videoConsumer = consumers.find(
            c => c.appData.user === p.id && c.kind === 'video',
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
        }),
      ),
      viewersWithRaisedHands: arrayToMap<IParticipant>(raisedHands),
      role: 'viewer',
    });
  },
});
