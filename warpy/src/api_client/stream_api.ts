import {APIModule} from './types';

export interface IStreamAPI {
  create: (title: string, hub: string) => any;
  stop: (stream: string) => any;
  join: (stream: string) => any;
  getViewers: (stream: string) => any;
  raiseHand: () => any;
  allowSpeaker: (speaker: string) => any;
}

export const StreamAPI: APIModule<IStreamAPI> = socket => ({
  create: (title, hub) =>
    socket.request('stream-new', {
      title,
      hub,
    }),
  stop: stream => socket.request('stream-stop', {stream}),
  join: stream => socket.publish('join-stream', {stream}),
  getViewers: stream => socket.request('viewers', {stream}),
  raiseHand: () => socket.publish('raise-hand', {}),
  allowSpeaker: speaker => socket.publish('speaker-allow', {speaker}),
});
