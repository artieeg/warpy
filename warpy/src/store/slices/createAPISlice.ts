import {GetState, SetState} from 'zustand';
import {APIClient, WebSocketConn} from '@warpy/api';
import config from '@app/config';
import {IStore} from '../useStore';

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

    api.stream.onNewViewer(data => {
      store.addViewer(data.viewer);
    });

    api.stream.onActiveSpeaker(data => {
      store.setActiveSpeakers(data.speakers);
    });

    api.stream.onNewRaisedHand(data => {
      const participant = data.viewer;
      participant.isRaisingHand = true;

      store.raiseHand(participant);
    });

    api.stream.onRoleUpdate(async ({mediaPermissionToken, media, role}) => {
      await get().sendMedia(mediaPermissionToken, media, [
        role === 'speaker' ? 'audio' : 'video',
      ]);

      set({
        role,
      });
    });

    api.media.onNewTrack(async data => {
      const {mediaClient, recvTransport} = get();

      if (mediaClient && recvTransport) {
        await mediaClient.consumeRemoteStream(
          data.consumerParameters,
          data.user,
          recvTransport,
        );
      }
    });

    api.stream.onParticipantRoleChange(data => {
      const {user} = data;

      store.addProducer(user);
    });

    api.stream.onUserLeft(data => {
      const {user} = data;

      store.removeParticipant(user);
    });

    api.stream.onChatMessages(data => {
      const {messages} = data;

      store.addMessages(messages);
    });

    api.stream.onUserKick(({user}) => {
      store.removeParticipant(user);
    });

    api.notification.onNewNotification(data => {
      get().addNotification(data.notification);
    });

    api.notification.onNotificationDelete(data => {
      get().removeNotification(data.notification_id);
    });
  },
});
