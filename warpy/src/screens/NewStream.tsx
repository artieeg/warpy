import {useLocalVideoStream, useMediaStreaming} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {StopStream, Button} from '@app/components';
import {useRecvTransport} from '@app/hooks/useRecvTransport';
import {StreamerPanel} from '@app/components/StreamerPanel';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

export const NewStream = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [streamId, createStream, api] = useStore(
    state => [state.stream, state.create, state.api],
    shallow,
  );

  const modal = useStore.use.modalCurrent();
  const openNewModal = useStore.use.openNewModal();

  const recvTransport = useRecvTransport();

  const {width, height} = useWindowDimensions();
  const {
    stream: localMediaStream,
    switchCamera,
    toggle,
    muted,
  } = useLocalVideoStream();

  useMediaStreaming({stream: localMediaStream, kind: 'video'});
  useMediaStreaming({stream: localMediaStream, kind: 'audio'});

  const onStart = useCallback(() => {
    if (streamId) {
      return;
    }

    createStream(title, hub, recvTransport);
  }, [title, streamId, hub, api, recvTransport]);

  const onStopStream = () => {
    api.stream.stop(streamId!);
  };

  const localStreamStyle = {
    ...styles.localStream,
    width,
    height,
  };

  return (
    <View style={styles.wrapper}>
      {localMediaStream && (
        <RTCView
          style={localStreamStyle}
          objectFit="cover"
          streamURL={localMediaStream.toURL()}
        />
      )}
      {streamId && <StopStream onPress={onStopStream} />}
      {streamId && (
        <StreamerPanel
          visible={!modal}
          micIsOn={!muted}
          onOpenParticipantsList={() => openNewModal('participants')}
          onMicToggle={toggle}
          onFlipCamera={switchCamera}
        />
      )}

      {!streamId && (
        <View style={styles.startStreamButton}>
          <Button onPress={onStart} title="Start" />
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
  startStreamButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#303030',
  },
});
