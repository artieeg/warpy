import React, {useEffect, useRef} from 'react';
import {User} from '@app/models';
import {Animated, StyleSheet} from 'react-native';
import {Avatar} from './Avatar';

interface ISpeakerProps {
  user: User;
  isSpeaking?: boolean;
  volume: number;
}

export const Speaker = (props: ISpeakerProps) => {
  const {user, isSpeaking, volume} = props;

  const scale = useRef(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(scale.current, {
      toValue: 1 + volume / 100,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [volume]);

  const scaleStyle = {
    transform: [
      {
        scale: scale.current,
      },
    ],
  };

  return (
    <Animated.View
      style={[styles.wrapper, scaleStyle, isSpeaking && styles.isSpeaking]}>
      <Avatar user={user} />
    </Animated.View>
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
    backgroundColor: '#BDF971',
    borderRadius: 60,
  },
});
