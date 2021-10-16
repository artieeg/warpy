import {GetState, SetState} from 'zustand';
import produce from 'immer';
import {IStore} from '../useStore';
import {arrayToMap} from '@app/utils';
import {IParticipant, Roles} from '@warpy/lib';
import {Consumer} from 'mediasoup-client/lib/types';

interface IParticipantWithMedia extends IParticipant {
  media?: {
    audio?: {
      consumer: Consumer;
      track: MediaStream;
    };
    video?: {
      consumer: Consumer;
      track: MediaStream;
    };
  };
}

export interface IStreamSlice {
  /** Stores current stream id */
  stream: string | null;
  title: string | null;

  role: Roles | null;

  isSpeaker: boolean | null;
  isStreamOwner: boolean;

  /** Stores latest fetched viewers page*/
  latestViewersPage: number;

  /**
   * Initialized after joining.
   * Updates once a new user joins or leaves the stream
   * */
  totalParticipantCount: number;

  isFetchingViewers: boolean;

  /** Stream viewers */
  consumers: Record<string, IParticipantWithMedia>;

  /** Users sending audio/video streams */
  producers: Record<string, IParticipantWithMedia>;

  viewersWithRaisedHands: Record<string, IParticipant>;

  create: (title: string, hub: string) => Promise<void>;
  join: (id: string) => Promise<void>;

  setCount: (newCount: number) => any;
  fetchMoreViewers: () => Promise<void>;
  addViewers: (viewers: IParticipant[], page: number) => void;
  addViewer: (viewer: IParticipant) => void;
  addProducer: (speaker: IParticipant) => void;
  addProducers: (speakers: IParticipant[]) => void;
  raiseHand: (user: IParticipant) => void;
  removeParticipant: (user: string) => void;
}

export const createStreamSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IStreamSlice => ({
  stream: null,
  role: null,
  isSpeaker: false,
  latestViewersPage: -1,
  isFetchingViewers: false,
  totalParticipantCount: 0,
  viewersWithRaisedHands: {},
  isStreamOwner: false,

  /** Audio/video streamers */
  producers: {},

  consumers: {},

  title: null,

  async create(title, hub) {
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

    await sendMedia(mediaPermissionsToken, mediaData, ['audio', 'video']);
  },

  async join(stream) {
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

    console.log(recvMediaParams);

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

  async fetchMoreViewers() {
    set({isFetchingViewers: true});

    const {api} = get();
    const {latestViewersPage: page, stream} = get();

    if (!stream) {
      return;
    }

    const {viewers} = await api.stream.getViewers(stream, page + 1);

    set(
      produce<IStreamSlice>(state => {
        state.isFetchingViewers = false;
        viewers.forEach(viewer => (state.consumers[viewer.id] = viewer));
      }),
    );
  },

  setCount(newCount) {
    set(() => ({totalParticipantCount: newCount}));
  },

  removeParticipant(user) {
    set(
      produce<IStreamSlice>(state => {
        state.totalParticipantCount--;

        delete state.consumers[user];
        delete state.viewersWithRaisedHands[user];
        delete state.producers[user];
      }),
    );
  },

  addProducer(user) {
    set(
      produce<IStreamSlice>(state => {
        delete state.consumers[user.id];
        delete state.viewersWithRaisedHands[user.id];

        state.producers[user.id] = user;
      }),
    );
  },

  addProducers(speakers) {
    set(() => {
      speakers;
    });
  },

  raiseHand(user) {
    set(
      produce<IStreamSlice>(state => {
        delete state.consumers[user.id];
        state.viewersWithRaisedHands[user.id] = {
          ...user,
          isRaisingHand: true,
        };
      }),
    );
  },

  addViewers(viewers, page) {
    set(
      produce<IStreamSlice>(state => {
        viewers.forEach(viewer => {
          state.consumers[viewer.id] = viewer;
        });

        state.latestViewersPage = page;
      }),
    );
  },

  addViewer(viewer) {
    set(
      produce<IStreamSlice>(state => {
        state.totalParticipantCount++;
        state.consumers[viewer.id] = viewer;
      }),
    );
  },
});
