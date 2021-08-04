import {APIModule} from './types';

export const StreamAPI: APIModule = socket => ({
  create: (title: string, hub: string) =>
    socket.request('stream-new' {
      title,
      hub,
    }),
  stop: (stream_id: string) => socket.request('stream-stop', {stream_id}),
  join: (stream_id: string) => socket.publish('join-stream', {stream_id}),
  getViewers: (stream_id: string) =>
    socket.request('stream_viewers', {stream_id}),
  raiseHand: (stream_id: string) => socket.publish('raise-hand', {}),
  allowSpeaker: (speaker: string) => socket.publish('speaker-allow', {speaker}),
});
