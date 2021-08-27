import React, {useEffect, useRef, useState} from 'react';
import {Animated, useWindowDimensions} from 'react-native';

interface IPanelButtonsHolderProps {
  style?: any;
  children: any[] | any;
  visible: boolean;
  hideDirection: 'left' | 'bottom';
}

export const PanelButtonsHolder = (props: IPanelButtonsHolderProps) => {
  const {hideDirection, visible} = props;
  const translate = useRef(new Animated.Value(0.0));
  const opacity = useRef(new Animated.Value(1.0));

  const {width, height} = useWindowDimensions();
  const [translateTarget, setTranslateTarget] = useState(0);

  const duration = 400;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translate.current, {
        toValue: visible ? 0 : translateTarget,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity.current, {
        toValue: visible ? 1 : 0,
        duration: duration / 5,
        delay: visible ? duration / 1.4 : 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateTarget]);

  const animateStyle = {
    opacity: opacity.current,
    transform: [
      hideDirection === 'left'
        ? {
            translateX: translate.current,
          }
        : {
            translateY: translate.current,
          },
    ],
  };

  return (
    <Animated.View
      onLayout={event => {
        if (hideDirection === 'left') {
          setTranslateTarget(width - event.nativeEvent.layout.x);
        } else {
          setTranslateTarget(height - event.nativeEvent.layout.y);
        }
      }}
      {...props}
      style={[props.style, animateStyle]}
    />
  );
};
