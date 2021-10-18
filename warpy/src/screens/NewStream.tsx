import {
  useLocalAudioStream,
  useLocalVideoStream,
  useMediaStreaming,
  useRemoteStreams,
} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Button} from '@app/components';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {StreamOverlay} from '@app/components/StreamOverlay';

export const NewStream = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [streamId, createStream, api] = useStore(
    state => [state.stream, state.create, state.api],
    shallow,
  );

  const {width, height} = useWindowDimensions();
  const {stream: localMediaStream} = useLocalVideoStream();
  useLocalAudioStream();

  const {videoStreams} = useRemoteStreams();

  const onStart = useCallback(() => {
    if (streamId) {
      return;
    }

    createStream(title, hub);
  }, [title, streamId, hub, api]);

  const localStreamStyle = {
    ...styles.localStream,
    width: videoStreams.length > 1 ? width / 2 : width,
    height: videoStreams.length > 0 ? height / 2 : height,
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
      {videoStreams[0] && (
        <RTCView
          style={localStreamStyle}
          objectFit="cover"
          streamURL={videoStreams[0].toURL()}
        />
      )}
      {streamId && <StreamOverlay />}

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
