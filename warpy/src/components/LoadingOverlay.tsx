import React, {useMemo, useState, useRef, useEffect} from 'react';
import {useWindowDimensions, View} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  useDerivedValue,
  Easing,
} from 'react-native-reanimated';
import {Text} from '@app/components';
import tinycolor from 'tinycolor2';
import {colors} from '@app/theme';
import {Stream} from '@warpy/lib';
import {OnboardOverlay} from './OnboardOverlay';

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
    const delay = Math.random() * DURATION * 1.2;
    const angle = Math.random() * Math.PI * 2;
    //const side = 50 + Math.random() * 80;
    const side = 30 + Math.random() * 100;

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
    setTimeout(() => {
      //withDelay seems to crash dev bundles
      progress.value = withTiming(1, {duration: DURATION, easing: Easing.ease});
    }, delay);

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
          translateY: progress.value * y,
        },
        {
          translateX: progress.value * x,
        },
      ],
    }),
    [x, y, side, dx, dy],
  );

  return <Animated.View style={style} />;
};

export type LoadingOverlayMode =
  | 'stream-join'
  | 'splash'
  | 'signup'
  | 'signup-provider'
  | 'signup-username'
  | 'signup-name'
  | 'signup-etiquette'
  | 'signup-avatar';

interface LoadingOverlayProps {
  mode: LoadingOverlayMode;
  stream?: Stream;
  enabled: boolean;
  onHide?: () => void;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  mode,
  enabled,
  stream,
  onHide,
}) => {
  const hideProgress = useDerivedValue(() => {
    return withTiming(enabled ? 0 : 1, {duration: 300});
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setTimeout(() => {
        onHide?.();
      }, 300);
    }
  }, [enabled]);

  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      top: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.black,
      transform: [{scale: interpolate(hideProgress.value, [0, 1], [1, 1.3])}],
      opacity: 1 - hideProgress.value,
    };
  }, [hideProgress]);

  return (
    <Animated.View pointerEvents="box-none" style={style}>
      <View>
        <View
          style={{alignItems: 'center', justifyContent: 'center', zIndex: 10}}
        >
          {(mode === 'splash' || mode === 'signup') && (
            <Text color="white" weight="extraBold" size="large">
              warpy
            </Text>
          )}

          {mode === 'stream-join' && stream && (
            <>
              <Text color="white" weight="bold" size="small">
                joining
              </Text>

              <Text color="green" weight="extraBold">
                {stream.title}
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

      {mode === 'signup' && <OnboardOverlay visible={mode === 'signup'} />}
    </Animated.View>
  );
};
