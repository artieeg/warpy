import {useAppUser, useLocalStream} from '@app/hooks';
import {createStream, onWebSocketEvent, sendAllowSpeaker} from '@app/services';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, useWindowDimensions, Alert} from 'react-native';
import {StopStream, Button} from '@app/components';
import {
  consumeRemoteStream,
  initSendDevice,
  sendMediaStream,
} from '@app/services/video';
import {useRecvTransport} from '@app/hooks/useRecvTransport';

export const NewStream = () => {
  const [streamId, setStreamId] = useState<string>();
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [user] = useAppUser();
  const userId: string = user!.id;
  const [sendRoomData, setSendRoomData] = useState<any>();
  const [recvRoomData, setRecvRoomData] = useState<any>();
  const [userSpeakRequest, setUserSpeakRequest] = useState<string>();

  const recvTransport = useRecvTransport({
    stream: streamId,
    recvTransportOptions: recvRoomData?.recvTransportOptions,
    routerRtpCapabilities: recvRoomData?.routerRtpCapabilities,
  });

  const {width, height} = useWindowDimensions();
  const localStream = useLocalStream('video');

  useEffect(() => {
    onWebSocketEvent('created-room', (data: any) => {
      setSendRoomData(data.media);
    });

    onWebSocketEvent('joined-room', (data: any) => {
      Alert.alert('joined room', JSON.stringify(data));
      setRecvRoomData(data);
    });

    onWebSocketEvent('raise-hand', (data: any) => {
      setUserSpeakRequest(data.user);
    });
  }, [streamId]);

  useEffect(() => {
    if (!recvTransport) {
      return;
    }

    onWebSocketEvent('new-speaker-track', (data: any) => {
      console.log('new spekaer track', data);
      consumeRemoteStream(data.consumerParameters, data.user, recvTransport);
    });
  }, [recvTransport]);

  useEffect(() => {
    if (sendRoomData && streamId && localStream) {
      initSendDevice(sendRoomData.routerRtpCapabilities).then(async () => {
        await sendMediaStream(localStream, streamId, sendRoomData, 'video');

        /*
        await consumeRemoteStreams(
          userId,
          streamId,
          sendRoomData.routerRtpCapabilities,
          sendRoomData.recvTransportOptions,
        );
         */
      });
    }
  }, [streamId, sendRoomData, localStream, userId]);

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
