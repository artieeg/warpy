import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
import {View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {colors} from '../../colors';
import {Text} from './Text';

export const ScreenTitle: React.FC<{}> = ({children}) => {
  const left = useSharedValue(0);
  const width = useRef<number>(0);

  const cover = useAnimatedStyle(() => ({
    left: left.value,
    top: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: colors.black,
  }));

  useFocusEffect(
    useCallback(() => {
      if (width.current !== 0) {
        left.value = withTiming(width.current, {
          duration: 300,
          easing: Easing.ease,
        });
      }

      return () => {
        left.value = 0;
      };
    }, []),
  );

  return (
    <View
      onLayout={e => {
        if (width.current === 0) {
          left.value = withTiming(e.nativeEvent.layout.width, {
            duration: 300,
            easing: Easing.ease,
          });
        }

        width.current = e.nativeEvent.layout.width;
      }}>
      <Text size="large" weight="extraBold">
        {children}
      </Text>
      <Animated.View style={cover} />
    </View>
  );
};
