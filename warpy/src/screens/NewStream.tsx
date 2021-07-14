import {useAppUser} from '@app/hooks';
import {createStream, onWebSocketEvent} from '@app/services';
import {
  mediaDevices,
  MediaStream,
  MediaTrackConstraints,
  RTCView,
} from 'react-native-webrtc';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Button, StyleSheet, useWindowDimensions} from 'react-native';
import {Device} from 'mediasoup-client';

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

const useDevice = () => {
  const device = useRef<Device>();

  useEffect(() => {
    device.current = new Device({handlerName: 'ReactNative'});
  }, []);

  return device.current;
};

export const NewStream = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [user] = useAppUser();
  const device = useDevice();
  const {width, height} = useWindowDimensions();

  const localStream = useLocalStream();
  console.log('localstream', localStream);

  const [streamId, setStreamId] = useState<string>();

  useEffect(() => {
    onWebSocketEvent('created-room', (data: any) => {
      console.log('craeted room data', data);
    });
  }, []);

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
      <View />
      <Button onPress={onStart} title="Start" />
      {localStream && (
        <RTCView
          objectFit="cover"
          style={localStreamStyle}
          streamURL={localStream.toURL()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  localStream: {
    backgroundColor: '#303030',
  },
});
