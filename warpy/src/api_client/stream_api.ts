import {APIModule} from './types';

export const StreamAPI: APIModule = socket => ({
  create: (title: string, hub: string) =>
    socket.request('stream_create', {
      title,
      hub,
    }),
});
