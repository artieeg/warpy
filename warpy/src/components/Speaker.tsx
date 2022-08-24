import React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar} from './Avatar';
import {useStore} from '@app/store';
import {AudioLevelIndicator} from './AudioLevelIndicator';

interface ISpeakerProps {
  id: string;
  volume: number;
  onDoneSpeaking: () => void;
}

export const Speaker = (props: ISpeakerProps) => {
  const {id, volume, onDoneSpeaking} = props;
  const user = useStore(state => state.streamers[id]);

  if (!user) {
    return null;
  }

  return (
    <AudioLevelIndicator
      volume={volume}
      onDoneSpeaking={onDoneSpeaking}
      style={styles.wrapper}>
      <Avatar useRNImage style={styles.avatar} user={user} />
    </AudioLevelIndicator>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  },
  wrapper: {
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 50,
    height: 50,
  },
});
