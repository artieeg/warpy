import {APIModule} from './types';

export const MediaAPI: APIModule = socket => ({
  newTrack: (data: any) => socket.publish('track_new', data),
  connectTransport: (data: any, isProducer: boolean = false) =>
    socket.publish({...data, isProducer}),
  getRecvTracks: (data: any) => socket.request('recv-tracks-request', data),
});
