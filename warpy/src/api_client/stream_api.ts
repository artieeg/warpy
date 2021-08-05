import {APIModule} from './types';

export interface IStreamAPI {
  create: (title: string, hub: string) => any;
  stop: (stream_id: string) => any;
  join: (stream_id: string) => any;
  getViewers: (stream_id: string) => any;
  raiseHand: () => any;
  allowSpeaker: (speaker: string) => any;
}

export const StreamAPI: APIModule<IStreamAPI> = socket => ({
  create: (title, hub) =>
    socket.request('stream-new', {
      title,
      hub,
    }),
  stop: stream_id => socket.request('stream-stop', {stream_id}),
  join: stream_id => socket.publish('join-stream', {stream_id}),
  getViewers: stream_id => socket.request('stream_viewers', {stream_id}),
  raiseHand: () => socket.publish('raise-hand', {}),
  allowSpeaker: speaker => socket.publish('speaker-allow', {speaker}),
});
