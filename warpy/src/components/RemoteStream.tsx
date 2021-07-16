import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Stream} from '@app/models';
import {
  onWebSocketEvent,
  sendJoinStream,
  sendRecvTracksRequest,
} from '@app/services';
import {Device} from 'mediasoup-client';
import {createTransport} from '@app/services/video';
import {useAppUser} from '@app/hooks';
import {MediaStream, RTCView} from 'react-native-webrtc';

interface IRemoteStreamProps {
  stream: Stream;
}

export const consumeRemoteStream = (
  user: string,
  stream: string,
  routerRtpCapabilities: any,
  recvTransportOptions: any,
) => {
  return new Promise(async resolve => {
    const device = new Device({handlerName: 'ReactNative'});
    await device.load({routerRtpCapabilities});

    console.log('CONSUMING STREAM ID', stream);

    const transport = await createTransport({
      roomId: stream,
      device,
      direction: 'recv',
      options: {recvTransportOptions},
    });

    onWebSocketEvent('recv-tracks-response', async (data: any) => {
      console.log('recv tracks respond', data);
      const {consumerParams} = data;

      const consumersPromises: Promise<any>[] = [];

      consumerParams.forEach(async (params: any) => {
        console.log('params', params);
        const {consumerParameters} = params;
        const promise = transport.consume({
          ...consumerParameters,
          appData: {
            user,
            producerId: consumerParameters.producerId,
            mediaTag: 'video',
          },
        });

        consumersPromises.push(promise);
      });

      const consumers = await Promise.all(consumersPromises);
      console.log('comsumer', consumers);
      const {track} = consumers[0];

      resolve(track);
    });

    sendRecvTracksRequest({
      rtpCapabilities: device.rtpCapabilities,
      stream,
    });
  });
};

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {stream} = props;
  const [user] = useAppUser();
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const id = stream.id;

  useEffect(() => {
    onWebSocketEvent('joined-room', async (data: any) => {
      const {routerRtpCapabilities, recvTransportOptions} = data;

      const track = await consumeRemoteStream(
        user.id,
        id,
        routerRtpCapabilities,
        recvTransportOptions,
      );

      console.log('track', track);
      setMediaStream(new MediaStream([track]));
    });

    sendJoinStream(id);
  }, [user?.id || null, id]);

  return (
    <View style={{width: 100, height: 200, backgroundColor: '#ff3030'}}>
      <View />
      {mediaStream && (
        <RTCView
          objectFit="cover"
          style={{width: 100, height: 200, backgroundColor: '#30ff30'}}
          streamURL={mediaStream.toURL()}
        />
      )}
    </View>
  );
};
