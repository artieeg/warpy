import {useAppUser} from '@app/hooks';
import {createStream, onWebSocketEvent} from '@app/services';
import {
  mediaDevices,
  MediaStream,
  MediaTrackConstraints,
  RTCView,
} from 'react-native-webrtc';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Button, StyleSheet, useWindowDimensions} from 'react-native';
import {Device} from 'mediasoup-client';
import {StopStream} from '@app/components';
import {createTransport} from '@app/services/video';

const useLocalStream = () => {
  const [localStream, setLocalStream] = useState<MediaStream>();

  const getVideoSource = useCallback(async () => {
    const devices = await mediaDevices.enumerateDevices();

    let videoSourceId = devices.find(
      (device: any) =>
        device.kind === 'videoinput' && device.facing === 'front',
    ).deviceId;

    //Why in the world getUserMedia returns boolean | MediaStream type??
    const mediaStream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: 'user',
        deviceId: videoSourceId,
        mandatory: {
          minWidth: 640,
          minHeight: 480,
          minFrameRate: 24,
        },
        optional: [],
      } as MediaTrackConstraints,
    });

    //F
    if (!mediaStream || mediaStream === true) {
      return;
    }

    setLocalStream(mediaStream);
  }, []);

  useEffect(() => {
    getVideoSource();
  }, [getVideoSource]);

  return localStream;
};

const sendVideoStream = async (
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

export const NewStream = () => {
  const [streamId, setStreamId] = useState<string>();
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [user] = useAppUser();
  const [roomData, setRoomData] = useState<any>();

  const {width, height} = useWindowDimensions();
  const localStream = useLocalStream();

  useEffect(() => {
    onWebSocketEvent('created-room', (data: any) => {
      setRoomData(data);
    });

    onWebSocketEvent('raise-hand', (data: any) => {
      console.log('participant raised hand', data);
    });
  }, [streamId]);

  useEffect(() => {
    if (roomData && streamId && localStream) {
      sendVideoStream(localStream, streamId, roomData);
    }
  }, [streamId, roomData, localStream]);

  const onStart = useCallback(async () => {
    const newStreamId = await createStream(title, hub);
    setStreamId(newStreamId);
  }, [title, hub]);

  const localStreamStyle = {
    ...styles.localStream,
    width,
    height,
  };

  return (
    <View>
      <Button onPress={onStart} title="Start" />

      {localStream && (
        <RTCView
          objectFit="cover"
          style={localStreamStyle}
          streamURL={localStream.toURL()}
        />
      )}
      <StopStream />
    </View>
  );
};

const styles = StyleSheet.create({
  localStream: {
    backgroundColor: '#303030',
  },
});
