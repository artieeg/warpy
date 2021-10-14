import {GetState, SetState} from 'zustand';
import {APIClient, WebSocketConn} from '@warpy/api';
import config from '@app/config';
import {IStore} from '../useStore';
import {Participant} from '@app/models';

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
      const participant = Participant.fromJSON(data.viewer);
      participant.isRaisingHand = true;

      store.raiseHand(participant);
    });

    api.stream.onRoleUpdate(async options => {
      await get().sendMedia(options.mediaPermissionToken, options.media, [
        'audio',
      ]);

      set({
        isSpeaker: true,
        role: 'speaker',
      });
    });

    api.stream.onNewSpeaker(data => {
      const {speaker} = data;

      store.addSpeaker(speaker);
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
