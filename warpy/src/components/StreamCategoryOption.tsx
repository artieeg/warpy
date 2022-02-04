import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {IStreamCategory} from '../../../lib';
import {colors} from '../../colors';
import {Text} from './Text';

interface StreamCategoryOptionProps {
  category: IStreamCategory;
  color: string;
  selected: boolean;
  onPress: () => any;
}

export const StreamCategoryOption = React.memo(
  ({category, color, selected, onPress}: StreamCategoryOptionProps) => {
    const colorTransition = useDerivedValue(() => {
      return withTiming(selected ? 1 : 0, {
        duration: 150,
        easing: Easing.ease,
      });
    }, [selected]);

    const style = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        colorTransition.value,
        [0, 1],
        ['#000000', color],
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

    return (
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={onPress}
        style={[styles.wrapper]}>
        <Animated.View style={[styles.container, style]}>
          <Text animated size="small" style={textStyle}>
            {category.title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 35,
  },
});
