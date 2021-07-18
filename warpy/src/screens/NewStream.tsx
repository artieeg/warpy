import {useAppUser, useLocalStream} from '@app/hooks';
import {createStream, onWebSocketEvent, sendAllowSpeaker} from '@app/services';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {StopStream, Button} from '@app/components';
import {
  consumeRemoteStreams,
  initDevice,
  sendMediaStream,
} from '@app/services/video';

export const NewStream = () => {
  const [streamId, setStreamId] = useState<string>();
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [user] = useAppUser();
  const userId: string = user!.id;
  const [roomData, setRoomData] = useState<any>();
  const [userSpeakRequest, setUserSpeakRequest] = useState<string>();

  const {width, height} = useWindowDimensions();
  const localStream = useLocalStream('video');

  useEffect(() => {
    onWebSocketEvent('created-room', (data: any) => {
      setRoomData(data);
    });

    onWebSocketEvent('raise-hand', (data: any) => {
      console.log('raise hand event', data);
      setUserSpeakRequest(data.user);
    });
  }, [streamId]);

  useEffect(() => {
    if (roomData && streamId && localStream) {
      initDevice(roomData.routerRtpCapabilities).then(async () => {
        await sendMediaStream(localStream, streamId, roomData, 'video');

        await consumeRemoteStreams(
          userId,
          streamId,
          roomData.routerRtpCapabilities,
          roomData.recvTransportOptions,
        );
      });
    }
  }, [streamId, roomData, localStream, userId]);

  const onStart = useCallback(async () => {
    const newStreamId = await createStream(title, hub);
    setStreamId(newStreamId);
  }, [title, hub]);

  const localStreamStyle = {
    ...styles.localStream,
    width,
    height,
  };

  const onAllowSpeaking = () => {
    console.log(`allowing ${userSpeakRequest} to speak`);
    sendAllowSpeaker(streamId!, userSpeakRequest!);
    setUserSpeakRequest(undefined);
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
      {userSpeakRequest && (
        <View style={styles.allowSpeaking}>
          <Button
            title={`allow ${userSpeakRequest} to speak`}
            onPress={onAllowSpeaking}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  localStream: {
    backgroundColor: '#303030',
  },
  allowSpeaking: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
  },
});
