import React, {useEffect, useMemo, useRef} from 'react';
import {User} from '@app/models';
import {Animated, StyleSheet, View} from 'react-native';
import {Avatar} from './Avatar';
import {useStore} from '@app/store';

interface ISpeakerProps {
  id: string;
  volume: number;
  onDoneSpeaking: () => void;
}

export const Speaker = (props: ISpeakerProps) => {
  const {id, volume, onDoneSpeaking} = props;
  const user = useMemo(() => useStore.getState().producers[id], [id]);

  const scale = useRef(new Animated.Value(1));

  const anim = useRef<Animated.CompositeAnimation>();
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    anim.current = Animated.sequence([
      Animated.timing(scale.current, {
        toValue: 1 + (30 - volume) / 100,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale.current, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);

    anim.current.start();

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    hideTimeout.current = setTimeout(() => {
      Animated.timing(scale.current, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        onDoneSpeaking();
      });
    }, 400);
  }, [volume]);

  const scaleStyle = {
    transform: [
      {
        scale: scale.current,
      },
    ],
  };

  return (
    <Animated.View style={[styles.wrapper, scaleStyle]}>
      <Animated.View
        style={[
          styles.indicator,
          //scaleStyle,
          styles.isSpeaking,
        ]}></Animated.View>
      <Avatar useRNImage style={styles.avatar} user={user} />
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
