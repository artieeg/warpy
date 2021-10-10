import React, {useEffect, useMemo, useRef} from 'react';
import {User} from '@app/models';
import {Animated, StyleSheet, View} from 'react-native';
import {Avatar} from './Avatar';
import {useStore} from '@app/store';

interface ISpeakerProps {
  id: string;
  isSpeaking?: boolean;
  volume: number;
  onDoneSpeaking: () => void;
}

export const Speaker = (props: ISpeakerProps) => {
  const {id, isSpeaking, volume, onDoneSpeaking} = props;
  const user = useMemo(() => useStore.getState().speakers[id], [id]);

  const avatarScale = useRef(new Animated.Value(1));
  const scale = useRef(new Animated.Value(1));

  useEffect(() => {
    console.log('changed volume', volume);
    Animated.sequence([
      Animated.timing(scale.current, {
        toValue: 1 + (70 - volume) / 100,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(avatarScale.current, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('done speakeing');
      onDoneSpeaking();
    });
  }, [volume]);

  const avatarScaleStyle = {
    transform: [
      {
        scale: avatarScale.current,
      },
    ],
  };

  const scaleStyle = {
    transform: [
      {
        scale: scale.current,
      },
    ],
  };

  return (
    <Animated.View style={[styles.wrapper, avatarScaleStyle]}>
      <Animated.View
        style={[
          styles.indicator,
          scaleStyle,
          styles.isSpeaking,
        ]}></Animated.View>
      <Avatar style={styles.avatar} user={user} />
    </Animated.View>
  );
};
/**
 *
 */

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
  indicator: {
    borderRadius: 45,
    position: 'absolute',
    aspectRatio: 1,
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
  },
  isSpeaking: {
    backgroundColor: '#BDF97130',
    borderRadius: 60,
  },
});
