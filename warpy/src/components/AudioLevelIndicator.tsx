import React, {useEffect, useRef} from 'react';
import {ViewProps, Animated} from 'react-native';

interface IAudioLevelIndicatorProps extends ViewProps {
  volume: number;
  children: any;
  onDoneSpeaking: () => void;
  minScale?: number;
}

export const AudioLevelIndicator = (props: IAudioLevelIndicatorProps) => {
  const {volume, onDoneSpeaking, minScale} = props;
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
        toValue: minScale || 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        onDoneSpeaking();
      });
    }, 400);
  }, [volume, minScale]);

  const scaleStyle = {
    transform: [
      {
        scale: scale.current,
      },
    ],
  };

  return (
    <Animated.View style={[props.style, scaleStyle]}>
      {props.children}
    </Animated.View>
  );
};
