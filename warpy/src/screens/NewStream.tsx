import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from '@app/components';
import {StreamOverlay} from '@app/components/StreamOverlay';
import {Room} from '@app/components/Streams';
import {useNewStreamController} from '@app/hooks/useNewStreamController';

export const NewStream = () => {
  const {streamId, onStart} = useNewStreamController();

  return (
    <View style={styles.wrapper}>
      <Room forceLocalStream />

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
