import {APIModule} from './types';

export const APIObserver: APIModule = socket => ({
  on: (event: WebSocketEvent, handler: any) =>
    socket.observer.on(event, handler),
  off: (event: WebSocketEvent, handler?: any) =>
    socket.observer.off(event, handler),
  once: (event: WebSocketEvent, handler: any) =>
    socket.observer.once(event, handler),
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
