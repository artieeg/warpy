import React from 'react';
import {Speaker} from './Speaker';
import {StyleSheet, View} from 'react-native';
import {useDispatcher, useStoreShallow} from '@app/store';

interface ISpeakersProps {
  style?: any;
}

export const Speakers = (props: ISpeakersProps) => {
  const {style} = props;
  const dispatch = useDispatcher();

  const [activeSpeakers] = useStoreShallow(state => [state.userAudioLevels]);

  return (
    <View style={[styles.container, style]}>
      {Object.entries(activeSpeakers).map(([speaker, volume]) => (
        <Speaker
          onDoneSpeaking={() =>
            dispatch(({stream}) => stream.delAudioLevel(speaker))
          }
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
