import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from '@app/components';
import {StreamOverlay} from '@app/components/StreamOverlay';
import {Room} from '@app/components/Room';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {NewStreamPanel} from '@app/components/NewStreamPanel';

export const useNewStreamController = () => {
  const [streamId, dispatchMediaRequest] = useStore(
    state => [state.stream, state.dispatchMediaRequest],
    shallow,
  );

  useEffect(() => {
    dispatchMediaRequest('audio', {enabled: true});
    dispatchMediaRequest('video', {enabled: true});
  }, []);

  return {streamId};
};

export const NewStream = () => {
  const {streamId} = useNewStreamController();

  return (
    <View style={styles.wrapper}>
      <Room />

      {streamId && <StreamOverlay />}

      {!streamId && <NewStreamPanel />}
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
