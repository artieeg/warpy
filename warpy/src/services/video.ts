import {MediaDirection} from '@app/types';
import {Device} from 'mediasoup-client';
import {TransportOptions} from 'mediasoup-client/lib/Transport';
import {
  onWebSocketEvent,
  sendConnectTransport,
  sendNewTrack,
} from './websocket';

interface ICreateTransportParams {
  roomId: string;
  device: Device;
  direction: MediaDirection;
  options: TransportOptions;
}

export const createTransport = (params: ICreateTransportParams) => {
  const {device, direction, options} = params;

  const transport =
    direction === 'recv'
      ? device.createRecvTransport(options)
      : device.createSendTransport(options);

  //Source: https://mediasoup.org/documentation/v3/mediasoup-client/api/
  //Transport is about to establish the ICE+DTLS connection and
  //needs to exchange information with the associated server side transport.
  transport.on('connect', ({dtlsParameters}, callback, _errback) => {
    onWebSocketEvent(`${direction}-transport-connected`, (_data: any) => {
      callback();
    });
    sendConnectTransport({
      transportId: options.id,
      dtlsParameters,
      direction,
    });
  });

  //Source: https://mediasoup.org/documentation/v3/mediasoup-client/api/
  //Emitted when the transport needs to transmit information
  //about a new producer to the associated server side transport.
  //This event occurs before the produce() method completes.
  if (direction === 'send') {
    transport.on('produce', (produceParams, callback, errback) => {
      const {kind, rtpParameters, appData} = produceParams;

      onWebSocketEvent('send-track-created', (data: any) => {
        const id = data.id;

        if (id !== null) {
          callback({id});
        } else {
          errback();
        }

        sendNewTrack({
          transportId: options.id,
          kind,
          rtpParameters,
          rtpCapabilities: device!.rtpCapabilities,
          paused: false,
          appData,
          direction,
        });
      });
      //TODO: send track info and receive track id
    });
  }

  transport.on('connectionstatechange', _state => {
    //TODO
  });

  return transport;
};
