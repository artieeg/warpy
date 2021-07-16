import React, {useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
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
import {Speakers} from './Speakers';

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

    const transport = await createTransport({
      roomId: stream,
      device,
      direction: 'recv',
      options: {recvTransportOptions},
    });

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
            mediaTag: 'video',
          },
        });

        consumersPromises.push(promise);
      });

      const consumers = await Promise.all(consumersPromises);
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

      setMediaStream(new MediaStream([track]));
    });

    sendJoinStream(id);
  }, [user?.id || null, id]);

  const {width, height} = useWindowDimensions();

  const wrapperStyle = {
    ...styles.wrapper,
    height,
    width,
  };

  const mediaStyle = {
    ...styles.media,
    height,
    width,
  };

  return (
    <View style={wrapperStyle}>
      {mediaStream && (
        <RTCView
          objectFit="cover"
          style={mediaStyle}
          streamURL={mediaStream.toURL()}
        />
      )}
      <Speakers speakers={stream.participants} style={styles.speakers} />
    </View>
  );
};

const styles = StyleSheet.create({
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ff3030',
  },
  wrapper: {
    backgroundColor: '#30ff30',
  },
  speakers: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
