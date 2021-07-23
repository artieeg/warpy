import {MediaDirection} from '@app/types';
import {Device} from 'mediasoup-client';
import {Consumer} from 'mediasoup-client/lib/Consumer';
import {MediaKind} from 'mediasoup-client/lib/RtpParameters';
import {Transport} from 'mediasoup-client/lib/types';
import {MediaStream} from 'react-native-webrtc';
import {
  onWebSocketEvent,
  sendConnectTransport,
  sendNewTrack,
  sendRecvTracksRequest,
} from './websocket';

interface ICreateTransportParams {
  roomId: string;
  device: Device;
  direction: MediaDirection;
  options: any;
  isProducer: boolean;
}

export const createTransport = async (params: ICreateTransportParams) => {
  const {roomId, device, direction, options, isProducer} = params;

  const transportOptions =
    direction === 'recv'
      ? options.recvTransportOptions
      : options.sendTransportOptions;

  const transport =
    direction === 'recv'
      ? device.createRecvTransport(transportOptions)
      : device.createSendTransport(transportOptions);

  //Source: https://mediasoup.org/documentation/v3/mediasoup-client/api/
  //Transport is about to establish the ICE+DTLS connection and
  //needs to exchange information with the associated server side transport.
  transport.on('connect', ({dtlsParameters}, callback, _errback) => {
    onWebSocketEvent(`${direction}-transport-connected`, (_data: any) => {
      callback();
    });

    sendConnectTransport(
      {
        transportId: transportOptions.id,
        dtlsParameters,
        direction,
        roomId: roomId,
      },
      isProducer,
    );
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
      });

      sendNewTrack({
        transportId: transportOptions.id,
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

export let recvDevice: Device;
export let sendDevice: Device;

export const initSendDevice = async (routerRtpCapabilities: any) => {
  if (!sendDevice) {
    sendDevice = new Device({handlerName: 'ReactNative'});
  }

  if (!sendDevice.loaded) {
    await sendDevice.load({routerRtpCapabilities});
  }
};

export const initRecvDevice = async (routerRtpCapabilities: any) => {
  if (!recvDevice) {
    recvDevice = new Device({handlerName: 'ReactNative'});
  }

  if (!recvDevice.loaded) {
    await recvDevice.load({routerRtpCapabilities});
  }
};

export const sendMediaStream = async (
  localStream: MediaStream,
  stream: string,
  options: any,
  kind: MediaKind,
) => {
  const sendTransport = await createTransport({
    roomId: stream,
    device: sendDevice,
    direction: 'send',
    options: {
      sendTransportOptions: options.sendTransportOptions,
    },
    isProducer: true,
  });

  const track =
    kind === 'video'
      ? localStream.getVideoTracks()[0]
      : localStream.getAudioTracks()[0];

  await sendTransport.produce({
    track,
    appData: {mediaTag: 'media'},
  });
};

export const consumeRemoteStream = async (
  consumerParameters: any,
  user: string,
  transport: Transport,
) => {
  const consumer = await transport.consume({
    ...consumerParameters,
    appData: {
      user,
      producerId: consumerParameters.producerId,
      mediaTag: 'remote-media',
    },
  });

  console.log('data', consumerParameters);
  console.log('remote stream', consumer);

  return consumer;
};

export const consumeRemoteStreams = (
  user: string,
  stream: string,
  transport: Transport,
): Promise<Consumer[]> => {
  return new Promise(async resolve => {
    onWebSocketEvent('recv-tracks-response', async (data: any) => {
      const {consumerParams} = data;

      const consumersPromises: Promise<any>[] = [];

      consumerParams.forEach(async (params: any) => {
        const {consumerParameters} = params;
        const promise = transport.consume({
          ...consumerParameters,
          appData: {
            user,
            producerId: consumerParameters.producerId,
            mediaTag: 'video-' + Math.random(),
          },
        });

        consumersPromises.push(promise);
      });

      const consumers = await Promise.all(consumersPromises);

      resolve(consumers);
    });

    sendRecvTracksRequest({
      rtpCapabilities: recvDevice.rtpCapabilities,
      stream,
    });
  });
};
