import React, {useEffect, useRef} from 'react';
import {User} from '@app/models';
import {Animated, StyleSheet, View} from 'react-native';
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
    Animated.sequence([
      Animated.timing(scale.current, {
        toValue: 1 + volume / 80,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [volume]);

  const scaleStyle = {
    transform: [
      {
        scale: scale.current,
      },
    ],
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[styles.indicator, scaleStyle, styles.isSpeaking]}
      />
      <Avatar user={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    //padding: 6,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    width: 50,
    height: 50,
  },
  indicator: {
    borderRadius: 45,
    position: 'absolute',
    aspectRatio: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  isSpeaking: {
    backgroundColor: '#BDF971',
    borderRadius: 60,
  },
});
