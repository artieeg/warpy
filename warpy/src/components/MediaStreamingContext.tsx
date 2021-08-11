import {MediaDirection} from '@app/types';
import {Device} from 'mediasoup-client';
import {
  Consumer,
  MediaKind,
  Producer,
  Transport,
} from 'mediasoup-client/lib/types';
import React, {createContext, useContext, useState} from 'react';
import {Alert} from 'react-native';
import {MediaStream} from 'react-native-webrtc';
import {useWebSocketContext} from './WebSocketContext';

interface ICreateTransportParams {
  roomId: string;
  device: Device;
  direction: MediaDirection;
  options: any;
  isProducer: boolean;
  mediaKind?: MediaKind;
}

export const MediaStreamingContext = createContext<any>({});

export const useMediaStreamingContext = () => {
  return useContext(MediaStreamingContext);
};

let recvDevice = new Device({handlerName: 'ReactNative'});
let sendDevice = new Device({handlerName: 'ReactNative'});

export const MediaStreamingProvider = ({children}: any) => {
  const ws = useWebSocketContext();
  const [permissionsToken, setPermissionsToken] = useState<string | null>(null);

  const createTransport = async (params: ICreateTransportParams) => {
    const {roomId, device, direction, options, isProducer, mediaKind} = params;

    if (direction === 'send') {
      Alert.alert('creating send transport');
    }

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
      if (direction === 'send') {
        ws.media.onceSendTransportConnected(() => {
          Alert.alert('send transport connected');
          callback();
        });
      } else {
        ws.media.onceRecvTransportConnected(callback);
      }

      console.log('sending connect transport request', roomId);
      ws.media.connectTransport(
        {
          transportId: transportOptions.id,
          dtlsParameters,
          direction,
          roomId: roomId,
          mediaKind,
          mediaPermissionsToken: permissionsToken,
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

        ws.observer.once('@media/send-track-created', (data: any) => {
          const id = data.id;

          if (id !== null) {
            callback({id});
          } else {
            errback();
          }
        });

        ws.media.newTrack({
          transportId: transportOptions.id,
          kind,
          rtpParameters,
          rtpCapabilities: device!.rtpCapabilities,
          paused: false,
          roomId: roomId,
          appData,
          direction,
          mediaPermissionsToken: permissionsToken,
        });
      });
    }

    transport.on('connectionstatechange', _state => {
      //TODO
    });

    return transport;
  };

  const initSendDevice = async (routerRtpCapabilities: any) => {
    if (!sendDevice) {
      sendDevice = new Device({handlerName: 'ReactNative'});
    }

    if (!sendDevice.loaded) {
      await sendDevice.load({routerRtpCapabilities});
    }
  };

  const initRecvDevice = async (routerRtpCapabilities: any) => {
    if (!recvDevice) {
      recvDevice = new Device({handlerName: 'ReactNative'});
    }

    if (!recvDevice.loaded) {
      await recvDevice.load({routerRtpCapabilities});
    }
  };

  const sendMediaStream = async (
    localStream: MediaStream,
    stream: string,
    options: any,
    kind: MediaKind,
  ) => {
    console.log('jwt token', permissionsToken);
    const sendTransport = await createTransport({
      roomId: stream,
      device: sendDevice,
      direction: 'send',
      options: {
        sendTransportOptions: options.sendTransportOptions[kind],
      },
      mediaKind: kind,
      isProducer: true,
    });

    const track =
      kind === 'video'
        ? localStream.getVideoTracks()[0]
        : localStream.getAudioTracks()[0];

    await sendTransport.produce({
      track,
      appData: {kind},
    });
  };

  const consumeRemoteStream = async (
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

    return consumer;
  };

  const consumeRemoteStreams = async (
    user: string,
    stream: string,
    transport: Transport,
  ): Promise<Consumer[]> => {
    const {consumerParams} = await ws.media.getRecvTracks({
      rtpCapabilities: recvDevice.rtpCapabilities,
      stream,
      mediaPermissionsToken: permissionsToken,
    });

    const consumersPromises: Promise<Consumer>[] = consumerParams.map(
      (params: any) =>
        transport.consume({
          ...params.consumerParameters,
          appData: {
            user,
            producerId: params.consumerParameters.producerId,
            mediaTag: 'media-' + Math.random(),
          },
        }),
    );

    const consumers = await Promise.all(consumersPromises);

    return consumers;
  };

  console.log('permissions tkoen', permissionsToken);

  return (
    <MediaStreamingContext.Provider
      value={{
        recvDevice,
        sendDevice,
        consumeRemoteStream,
        consumeRemoteStreams,
        sendMediaStream,
        initRecvDevice,
        initSendDevice,
        createTransport,
        permissionsToken,
        setPermissionsToken: (token: string) => setPermissionsToken(token),
      }}>
      {children}
    </MediaStreamingContext.Provider>
  );
};
