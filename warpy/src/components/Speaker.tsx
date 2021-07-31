import React from 'react';
import {User} from '@app/models';
import {StyleSheet, View} from 'react-native';
import {Avatar} from './Avatar';

interface ISpeakerProps {
  user: User;
}

export const Speaker = (props: ISpeakerProps) => {
  const {user} = props;

  return (
    <View style={[styles.wrapper]}>
      <Avatar user={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 6,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  isSpeaking: {
    backgroundColor: '#DCFDE1',
  },
});
