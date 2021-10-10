import React from 'react';
import {Speaker} from './Speaker';
import {StyleSheet, View} from 'react-native';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

interface ISpeakersProps {
  style?: any;
}

export const Speakers = (props: ISpeakersProps) => {
  const {style} = props;
  //const speakers = useStreamSpeakers();
  const [activeSpeakers, deleteActiveSpeaker] = useStore(
    state => [state.activeSpeakers, state.deleteActiveSpeaker],
    shallow,
  );

  return (
    <View style={[styles.container, style]}>
      {Object.entries(activeSpeakers).map(([speaker, volume]) => (
        <Speaker
          onDoneSpeaking={() => deleteActiveSpeaker(speaker)}
          volume={volume}
          key={speaker}
          id={speaker}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
});
