import {GetState, SetState} from 'zustand';
import {APIClient, WebSocketConn} from '@warpy/api';
import config from '@app/config';
import {IStore} from '../useStore';
import produce from 'immer';

export interface IAPISlice {
  api: APIClient;
  createAPISubscriptions: () => void;
}

const socket = new WebSocketConn(new WebSocket(config.WS));

export const createAPISlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IAPISlice => ({
  api: APIClient(socket),
  createAPISubscriptions: () => {
    const store = get();
    const {api} = store;

    api.stream.onNewParticipant(data => {
      store.dispatchViewerAdd(data.viewer);
    });

    api.stream.onActiveSpeaker(data => {
      store.dispatchAudioLevelsUpdate(data.speakers);
    });

    api.stream.onNewRaisedHand(data => {
      const participant = data.viewer;
      participant.isRaisingHand = true;

      store.dispatchRaisedHand(participant);
    });

    api.stream.onRoleUpdate(async ({mediaPermissionToken, media, role}) => {
      await get().dispatchUserRoleUpdate(role, mediaPermissionToken, media);
    });

    api.stream.onMediaToggle(data => {
      get().dispatchMediaToggle(data.user, {
        video: data.videoEnabled,
        audio: data.audioEnabled,
      });
      console.log(`${data.user} toggled media`, data);
    });

    api.botDev.onCreateBotConfirmRequest(({confirmation_id, bot}) => {
      get().dispatchModalOpen('bot-confirm', {
        botConfirmData: bot,
        botConfirmId: confirmation_id,
      });
    });

    api.media.onNewTrack(async data => {
      const {mediaClient, recvTransport} = get();

      if (mediaClient && recvTransport) {
        const consumer = await mediaClient.consumeRemoteStream(
          data.consumerParameters,
          data.user,
          recvTransport,
        );

        set(
          produce<IStore>(state => {
            state.streamers[data.user] = {
              ...state.streamers[data.user],
              media: {
                ...state.streamers[data.user],
                [consumer.kind]: {
                  consumer,
                  track: new MediaStream([consumer.track]),
                },
              } as any,
            };
          }),
        );
      }
    });

    api.stream.onParticipantRoleChange(data => {
      const {user} = data;

      store.dispatchStreamerAdd(user);
    });

    api.stream.onUserLeft(data => {
      const {user} = data;

      store.dispatchParticipantRemove(user);
    });

    api.stream.onChatMessages(data => {
      const {messages} = data;

      store.dispatchChatMessages(messages);
    });

    api.stream.onUserKick(({user}) => {
      store.dispatchParticipantRemove(user);
    });

    api.notification.onNewNotification(data => {
      get().dispatchNotificationAdd(data.notification);
    });

    api.notification.onNotificationDelete(data => {
      get().dispatchNotificationRemove(data.notification_id);
    });
  },
});
