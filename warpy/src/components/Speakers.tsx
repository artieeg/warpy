import React from 'react';
import {User} from '@app/models';
import {Speaker} from './Speaker';
import {StyleSheet, View} from 'react-native';

interface ISpeakersProps {
  speakers: User[];
  style?: any;
}

export const Speakers = (props: ISpeakersProps) => {
  const {speakers, style} = props;

  return (
    <View style={[styles.container, style]}>
      {speakers.map(speaker => (
        <Speaker key={speaker.id} user={speaker} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
  },
});
