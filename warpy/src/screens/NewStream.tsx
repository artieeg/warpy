import {useAppUser, useLocalStream} from '@app/hooks';
import {createStream, onWebSocketEvent} from '@app/services';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Button, StyleSheet, useWindowDimensions} from 'react-native';
import {StopStream} from '@app/components';
import {initDevice, sendVideoStream} from '@app/services/video';

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
      initDevice(roomData.routerRtpCapabilities).then(() => {
        sendVideoStream(localStream, streamId, roomData);
      });
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
