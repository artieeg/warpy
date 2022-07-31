import React, {useMemo, useState, useRef, useEffect} from 'react';
import {useWindowDimensions, View} from 'react-native';
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import {Text} from '@app/components';
import tinycolor from 'tinycolor2';
import {colors} from '../../colors';

const DURATION = 1000;

const IndicatorItem = () => {
  const color = useMemo(
    () =>
      tinycolor(colors.green)
        .spin(Math.random() * 360)
        .toHexString(),
    [],
  );

  const [flag, setFlag] = useState(false);

  const {width, height} = useWindowDimensions();

  const {x, y, delay, side, dx, dy} = useMemo(() => {
    const delay = Math.random() * DURATION * 2;
    const angle = Math.random() * Math.PI * 2;
    const side = 50 + Math.random() * 80;

    return {
      x: ((width - 50) * Math.cos(angle)) / 2,
      y: ((height - 50) * Math.sin(angle)) / 2,
      dx: 50 * Math.cos(angle),
      dy: 50 * Math.sin(angle),
      delay,
      side,
    };
  }, [flag]);

  const progress = useSharedValue(0);

  const t = useRef<any>();

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, {duration: DURATION}));

    clearTimeout(t.current);
    t.current = setTimeout(() => {
      progress.value = 0;
      setFlag(prev => !prev);
    }, DURATION + delay);

    return () => {
      clearTimeout(t.current);
    };
  }, [flag]);

  const style = useAnimatedStyle(
    () => ({
      top: dy,
      left: dx,
      width: side,
      height: side,
      position: 'absolute',
      borderRadius: side / 2,
      backgroundColor: color,
      opacity: interpolate(progress.value, [0, 0.25, 0.9, 1], [0, 1, 1, 0]),
      transform: [
        {scale: interpolate(progress.value, [0, 0.1, 1], [0, 0.25, 1])},
        {
          translateY: progress.value * y + dy,
        },
        {
          translateX: progress.value * x + dx,
        },
      ],
    }),
    [progress, x, y, side, dx, dy],
  );

  return <Animated.View style={style} />;
};

interface LoadingOverlayProps {
  mode: 'stream-join' | 'splash';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({mode}) => {
  return (
    <View>
      <View
        style={{alignItems: 'center', justifyContent: 'center', zIndex: 10}}>
        {mode === 'splash' && (
          <Text color="white" weight="extraBold" size="large">
            warpy
          </Text>
        )}

        {mode === 'stream-join' && (
          <>
            <Text color="white" weight="bold" size="small">
              joining
            </Text>

            <Text color="green" weight="extraBold">
              stream name
            </Text>
          </>
        )}
      </View>
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
      <IndicatorItem />
    </View>
  );
};
