import {MediaDirection} from '@app/types';
import {Device} from 'mediasoup-client';
import {TransportOptions} from 'mediasoup-client/lib/Transport';
import {MediaStream} from 'react-native-webrtc';
import {
  onWebSocketEvent,
  sendConnectTransport,
  sendNewTrack,
} from './websocket';

interface ICreateTransportParams {
  roomId: string;
  device: Device;
  direction: MediaDirection;
  options: any;
}

export const createTransport = async (params: ICreateTransportParams) => {
  const {roomId, device, direction, options} = params;
  console.log('OPTIONS', options);

  const transport =
    direction === 'recv'
      ? device.createRecvTransport(options.recvTransportOptions)
      : device.createSendTransport(options.sendTransportOptions);

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
      roomId: roomId,
    });
  });

  //Source: https://mediasoup.org/documentation/v3/mediasoup-client/api/
  //Emitted when the transport needs to transmit information
  //about a new producer to the associated server side transport.
  //This event occurs before the produce() method completes.
  if (direction === 'send') {
    console.log('attaching produce listener');
    transport.on('produce', (produceParams, callback, errback) => {
      const {kind, rtpParameters, appData} = produceParams;
      console.log('received produce params', produceParams);

      onWebSocketEvent('send-track-created', (data: any) => {
        const id = data.id;
        console.log('track created', id);

        if (id !== null) {
          callback({id});
        } else {
          errback();
        }
      });
      sendNewTrack({
        transportId: options.id,
        kind,
        rtpParameters,
        rtpCapabilities: device!.rtpCapabilities,
        paused: false,
        roomId: roomId,
        appData,
        direction,
      });
    });
  }

  transport.on('connectionstatechange', _state => {
    //TODO
  });

  return transport;
};

export const sendVideoStream = async (
  localStream: MediaStream,
  stream: string,
  options: any,
) => {
  const {routerRtpCapabilities} = options;
  const device = new Device({handlerName: 'ReactNative'});
  await device.load({routerRtpCapabilities});

  const sendTransport = await createTransport({
    roomId: stream,
    device,
    direction: 'send',
    options: {
      sendTransportOptions: options.sendTransportOptions,
    },
  });

  const video = localStream.getVideoTracks()[0];
  await sendTransport.produce({
    track: video,
    appData: {mediaTag: 'video'},
  });

  const recvTransport = await createTransport({
    roomId: stream,
    device,
    direction: 'recv',
    options: {
      recvTransportOptions: options.recvTransportOptions,
    },
  });

  //recvTransport.consume(...); TODO
};
