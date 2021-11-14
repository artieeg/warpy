import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from '@app/components';
import {StreamOverlay} from '@app/components/StreamOverlay';
import {Room} from '@app/components/Room';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

export const useNewStreamController = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [streamId, set, dispatchCreateStream, dispatchMediaRequest] = useStore(
    state => [
      state.stream,
      state.set,
      state.dispatchStreamCreate,
      state.dispatchMediaRequest,
    ],
    shallow,
  );

  useEffect(() => {
    dispatchMediaRequest('audio', {enabled: true});
    dispatchMediaRequest('video', {enabled: true});
  }, []);

  const onStart = useCallback(() => {
    dispatchCreateStream(title, hub);
  }, [title, hub]);

  useEffect(() => {
    set({
      audioEnabled: true,
      videoEnabled: true,
    });

    return () =>
      set({
        audioEnabled: false,
        videoEnabled: false,
      });
  }, []);

  return {onStart, streamId, setTitle, setHub};
};

export const NewStream = () => {
  const {streamId, onStart} = useNewStreamController();

  return (
    <View style={styles.wrapper}>
      <Room />

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
