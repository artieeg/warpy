import {arrayToMap} from '@app/utils';
import {IParticipant, Roles} from '@warpy/lib';
import {StoreSlice} from '../types';
import {IParticipantWithMedia} from '@app/types';

export interface IDispatcherSlice {
  dispatchRoleUpdate: (
    role: Roles,
    mediaPermissionToken: string,
    sendMediaParams?: any,
  ) => Promise<void>;

  dispatchCreateStream: (title: string, hub: string) => Promise<void>;
  dispatchJoinStream: (stream: string) => Promise<void>;
}

export const createDispatcherSlice: StoreSlice<IDispatcherSlice> = (
  set,
  get,
) => ({
  async dispatchRoleUpdate(role, mediaPermissionToken, sendMediaParams) {
    const oldRole = get().role;

    if (sendMediaParams) {
      set({sendMediaParams, role});
    } else {
      set({role});
    }

    if (role === 'viewer') {
      get().closeProducers(['audio', 'video']);
    } else if (role === 'speaker') {
      get().closeProducers(['video']);
    }

    if (oldRole === 'streamer' && role === 'speaker') {
      return;
    } else {
      const kind = role === 'speaker' ? 'audio' : 'video';
      await get().sendMedia(mediaPermissionToken, [kind]);
    }
  },

  async dispatchCreateStream(title, hub) {
    const {api, sendMedia, initViewerMedia} = get();

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
      producers: arrayToMap<IParticipant>(speakers),
      totalParticipantCount: count,
      isStreamOwner: true,
      role: 'streamer',
    });

    await initViewerMedia(mediaPermissionsToken, recvMediaParams);

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

    await sendMedia(mediaPermissionsToken, ['audio', 'video']);
  },

  async dispatchJoinStream(stream) {
    const {api, initViewerMedia} = get();

    const {
      mediaPermissionsToken,
      recvMediaParams,
      speakers,
      raisedHands,
      count,
    } = await api.stream.join(stream);

    await initViewerMedia(mediaPermissionsToken, recvMediaParams);

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
      producers: arrayToMap<IParticipantWithMedia>(
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
              },
              video: videoConsumer && {
                consumer: videoConsumer,
                track: new MediaStream([videoConsumer.track]),
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
