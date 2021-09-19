import React, {useMemo} from 'react';
import {Speaker} from './Speaker';
import {StyleSheet, View} from 'react-native';
import {useStreamSpeakers} from '@app/hooks';

interface ISpeakersProps {
  style?: any;
}

export const Speakers = (props: ISpeakersProps) => {
  const {style} = props;
  const speakers = useStreamSpeakers();

  const speakersSortedByVolume = useMemo(
    () => speakers.sort((first, second) => second.volume - first.volume),
    [speakers],
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
