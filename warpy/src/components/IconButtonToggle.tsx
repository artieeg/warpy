import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {Icon} from './Icon';
import {RoundButton} from './RoundButton';

export interface IIconButtonToggleProps {
  onToggle: () => any;
  icon: string;
  enabled?: boolean;
  style?: any;
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export const IconButtonToggle = (props: IIconButtonToggleProps) => {
  const {onToggle, icon, enabled, style} = props;
  const color = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(color.current, {
      toValue: enabled ? 100 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [enabled]);

  return (
    <RoundButton onPress={onToggle} style={styles.button}>
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: color.current.interpolate({
              inputRange: [0, 100],
              outputRange: ['rgba(0,0,0,0)', 'rgba(255,255,255, 255)'],
            }),
          },
        ]}>
        <AnimatedIcon
          size={30}
          style={[
            style,
            {
              color: color.current.interpolate({
                inputRange: [0, 100],
                outputRange: ['rgb(255,255,255)', 'rgb(0,0,0)'],
              }),
            },
          ]}
          name={icon}
        />
      </Animated.View>
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  enabled: {
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 45,
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
});
