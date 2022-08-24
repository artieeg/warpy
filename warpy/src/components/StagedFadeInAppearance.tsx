import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type StagedFadeInAppearanceProps = {
  children: React.ReactChild[];
};

export const StagedFadeInAppearance: React.FC<StagedFadeInAppearanceProps> =
  props => {
    //Memoize passed children
    const children = React.useMemo(() => props.children || [], []);

    //initialize opacity of children to 0
    const opacityValues = children.map(() => useSharedValue(0));

    const opacityStyles = opacityValues.map((opacity, idx) =>
      useAnimatedStyle(() => ({
        opacity: withDelay(
          idx * 300,
          withTiming(opacity.value, {
            duration: 300,
            easing: Easing.linear,
          }),
        ),
      })),
    );

    React.useEffect(() => {
      opacityValues.forEach(v => {
        v.value = 1;
      });
    }, []);

    return (
      <View>
        {children.map((child, idx) => (
          <Animated.View style={opacityStyles[idx]}>{child}</Animated.View>
        ))}
      </View>
    );
  };
