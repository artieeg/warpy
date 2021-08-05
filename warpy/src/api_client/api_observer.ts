import {APIModule} from './types';

export interface IAPIObserver {
  on: (event: WebSocketEvent, handler: any) => any;
  off: (event: WebSocketEvent, handler?: any) => any;
  once: (event: WebSocketEvent, handler: any) => any;
  removeAllListeners: () => any;
}

export const APIObserver: APIModule<IAPIObserver> = socket => ({
  on: (event, handler) => socket.observer.on(event, handler),
  off: (event, handler) => socket.observer.off(event, handler),
  once: (event, handler) => socket.observer.once(event, handler),
  removeAllListeners: () =>
    socket.observer
      .eventNames()
      .forEach((event: any) => socket.observer.removeAllListeners(event)),
});

type WebSocketEvent =
  | 'new-viewer'
  | 'stream-created'
  | 'raise-hand'
  | 'user-left'
  | 'feed'
  | 'whoami'
  | 'new-speaker'
  | 'viewers'
  | 'room-info'
  | 'created-room'
  | 'speaking-allowed'
  | '@media/recv-connect-params'
  | '@media/new-track'
  | '@media/send-transport-connected'
  | '@media/recv-transport-connected'
  | '@media/send-track-created'
  | '@media/recv-track-created'
  | 'speaker-send-transport'
  | 'recv-tracks-response';
