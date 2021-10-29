import React, {useMemo} from 'react';
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
  const user = useMemo(() => useStore.getState().streamers[id], [id]);

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
    //padding: 6,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 50,
    height: 50,
  },
});
