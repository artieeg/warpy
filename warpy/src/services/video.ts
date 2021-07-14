import {MediaDirection} from '@app/types';
import {Device} from 'mediasoup-client';
import {TransportOptions} from 'mediasoup-client/lib/Transport';

interface ICreateTransportParams {
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
  transport.on('connect', ({dtlsParameters}, callback, errback) => {
    //TODO;
  });

  //Source: https://mediasoup.org/documentation/v3/mediasoup-client/api/
  //Emitted when the transport needs to transmit information
  //about a new producer to the associated server side transport.
  //This event occurs before the produce() method completes.
  transport.on('produce', (params, callback, errback) => {
    const {kind, rtpParameters} = params;

    //TODO: send track info and receive track id
  });

  return transport;
};
