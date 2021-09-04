import React, {useEffect, useRef} from 'react';
import {Animated, StyleProp} from 'react-native';
import {Reaction} from './Reaction';

export interface IGivenReaction {
  x: number;
  y: number;
  key: number;
  timestamp: number;
  rotate: string;
  reaction: string;
}

export const GivenReaction = React.memo((props: IGivenReaction) => {
  const scale = useRef(new Animated.Value(2.5));
  const opacity = useRef(new Animated.Value(1));

  const size = 90;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        /*
        Animated.timing(opacity.current, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
         */
        Animated.timing(scale.current, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      //Animated.delay(300),
      Animated.timing(opacity.current, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const style: StyleProp<any> = {
    position: 'absolute',
    left: props.x,
    top: props.y,
    opacity: opacity.current,
    transform: [
      {rotate: props.rotate},
      {scale: scale.current},
      {
        translateX: -size / 2,
      },
      {
        translateY: -size / 2,
      },
    ],
  };

  return (
    <Animated.View style={style}>
      <Reaction size={size} code={props.reaction} />
    </Animated.View>
  );
});
