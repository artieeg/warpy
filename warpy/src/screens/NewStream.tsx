import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from '@app/components';
import {StreamOverlay} from '@app/components/StreamOverlay';
import {Room} from '@app/components/Room';
import {useNewStreamController} from '@app/hooks/useNewStreamController';
import {useStore} from '@app/store';

export const NewStream = () => {
  const {streamId, onStart} = useNewStreamController();

  const set = useStore.use.set();

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
