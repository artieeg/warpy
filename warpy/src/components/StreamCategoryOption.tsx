import React, {useEffect, useRef} from 'react';
import {StyleSheet, TouchableOpacity, ViewProps} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {IStreamCategory} from '@warpy/lib';
import {Text} from './Text';

interface StreamCategoryOptionProps extends ViewProps {
  category: IStreamCategory;
  color: string;
  selected: boolean;
  onPress: (position: {x: number; y: number; w: number}) => any;
}

export const StreamCategoryOption = React.memo(
  ({
    category,
    style,
    color,
    selected,
    onPress,
    ...rest
  }: StreamCategoryOptionProps) => {
    const colorTransition = useDerivedValue(() => {
      return withTiming(selected ? 1 : 0, {
        duration: 150,
        easing: Easing.ease,
      });
    }, [selected]);

    useEffect(() => {
      setTimeout(() => {
        if (category.id === 'foru') {
          ref.current?.measureInWindow((x: number, y: number, w: number) =>
            onPress({x, y, w}),
          );
        }
      }, 50);
    }, []);

    const position = useRef<{x: number; y: number}>();

    const animatedStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        colorTransition.value,
        [0, 1],
        ['#00000000', color],
      ),
      flex: 1,
      width: '100%',
    }));

    const textStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
        colorTransition.value,
        [1, 0],
        ['#000000', color],
      ),
    }));

    const ref = useRef<any>();

    return (
      <Animated.View
        {...rest}
        ref={ref}
        onLayout={e => {
          position.current = {
            x: e.nativeEvent.layout.x,
            y: e.nativeEvent.layout.y,
          };

          rest.onLayout?.(e);
        }}
        style={[styles.wrapper, animatedStyle, style]}>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => {
            ref.current?.measureInWindow((x: number, y: number, w: number) =>
              onPress({x, y, w}),
            );
          }}
          style={[styles.container]}>
          <Text animated size="small" style={textStyle}>
            {category.title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 10,
    borderRadius: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 35,
  },
});
