import {APIModule, EventHandler} from './types';
import {IRecvTracksRequest, IRecvTracksResponse} from '@warpy/lib';

export interface IMediaAPI {
  newTrack: (data: any) => any;
  connectTransport: (data: any, isProducer: boolean) => any;
  getRecvTracks: (data: any) => Promise<IRecvTracksResponse>;
  onceRecvConnectParams: EventHandler;
  onNewTrack: EventHandler;
  onceRecvTransportConnected: EventHandler;
  onceSendTransportConnected: EventHandler;
}

export const MediaAPI: APIModule = (socket): IMediaAPI => ({
  newTrack: (data: any) => socket.publish('new-track', data),
  connectTransport: (data: any, isProducer: boolean = false) =>
    socket.publish('connect-transport', {...data, isProducer}),
  getRecvTracks: (data: IRecvTracksRequest) =>
    socket.request('recv-tracks-request', data),
  onceRecvConnectParams: handler =>
    socket.once('@media/recv-connect-params', handler),
  onNewTrack: handler => socket.on('@media/new-track', handler),
  onceRecvTransportConnected: handler =>
    socket.once('@media/recv-transport-connected', handler),
  onceSendTransportConnected: handler =>
    socket.once('@media/send-transport-connected', handler),
});
