import {APIModule, EventHandler} from './types';

export interface IStreamAPI {
  create: (title: string, hub: string) => any;
  stop: (stream: string) => any;
  join: (stream: string) => any;
  getViewers: (stream: string, page: number) => any;
  raiseHand: () => any;
  allowSpeaker: (speaker: string) => any;
  onNewViewer: EventHandler;
  onNewRaisedHand: EventHandler;
  onUserLeft: EventHandler;
  onNewSpeaker: EventHandler;
  onSpeakingAllowed: EventHandler;
}

export const StreamAPI: APIModule<IStreamAPI> = socket => ({
  create: (title, hub) =>
    socket.request('stream-new', {
      title,
      hub,
    }),
  stop: stream => socket.publish('stream-stop', {stream}),
  join: stream => socket.request('join-stream', {stream}),
  getViewers: (stream, page) =>
    socket.request('request-viewers', {stream, page}),
  raiseHand: () => socket.publish('raise-hand', {}),
  allowSpeaker: speaker => socket.publish('speaker-allow', {speaker}),
  onNewViewer: handler => socket.on('new-viewer', handler),
  onNewRaisedHand: handler => socket.on('raise-hand', handler),
  onUserLeft: handler => socket.on('user-left', handler),
  onNewSpeaker: handler => socket.on('new-speaker', handler),
  onSpeakingAllowed: handler => socket.on('speaking-allowed', handler),
});
