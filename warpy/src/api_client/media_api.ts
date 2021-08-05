import {APIModule} from './types';

export interface IMediaAPI {
  newTrack: (data: any) => any;
  connectTransport: (data: any, isProducer: boolean) => any;
  getRecvTracks: (data: any) => any;
}

export const MediaAPI: APIModule = (socket): IMediaAPI => ({
  newTrack: (data: any) => socket.publish('new-track', data),
  connectTransport: (data: any, isProducer: boolean = false) =>
    socket.publish('connect-transport', {...data, isProducer}),
  getRecvTracks: (data: any) => socket.request('recv-tracks-request', data),
});
