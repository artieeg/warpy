import {useLocalAudioStream} from '@app/hooks';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from '@app/components';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {StreamOverlay} from '@app/components/StreamOverlay';
import {Streams} from '@app/components/Streams';

export const NewStream = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [streamId, createStream, api] = useStore(
    state => [state.stream, state.create, state.api],
    shallow,
  );

  useLocalAudioStream();

  const onStart = useCallback(() => {
    if (streamId) {
      return;
    }

    createStream(title, hub);
  }, [title, streamId, hub, api]);

  return (
    <View style={styles.wrapper}>
      <Streams />

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
    flexWrap: 'wrap',
  },
});
