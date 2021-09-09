import React from 'react';
import {Participant} from '@app/models';
import {Speaker} from './Speaker';
import {StyleSheet, View} from 'react-native';

interface ISpeakersProps {
  speakers: Participant[];
  style?: any;
}

export const Speakers = (props: ISpeakersProps) => {
  const {speakers, style} = props;

  const speakersSortedByVolume = speakers.sort(
    (first, second) => second.volume - first.volume,
  );

  return (
    <View style={[styles.container, style]}>
      {speakersSortedByVolume.slice(0, 3).map(speaker => (
        <Speaker
          volume={speaker.volume}
          isSpeaking={speaker.isSpeaking}
          key={speaker.id}
          user={speaker}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 54,
  },
});
