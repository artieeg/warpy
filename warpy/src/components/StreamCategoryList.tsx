import {useStore} from '@app/store';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, ViewProps, useWindowDimensions} from 'react-native';
import {StreamCategoryOption} from './StreamCategoryOption';
import tinycolor from 'tinycolor2';
import {IStreamCategory} from '@warpy/lib';
import Animated, {
  add,
  Easing,
  Extrapolate,
  interpolate,
  multiply,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const BASE_COLOR = tinycolor('F9AA71');

interface StreamCategoryListProps extends ViewProps {
  mode?: 'create-stream' | 'browse-feed';
  minimizationProgress?: SharedValue<number>;
}

export const StreamCategoryList: React.FC<StreamCategoryListProps> = props => {
  //const xOffset = useSharedValue(0);

  const streamCategory = useStore(state => state.selectedFeedCategory);

  const xOffset = useSharedValue(0);

  useEffect(() => {
    xOffset.value = 0;
  }, [streamCategory]);

  const selectedIndex = useRef<number>(0);
  const [currentCategoryPosition, setCurrentCategoryPosition] =
    useState<{x: number; y: number; w: number}>();

  const {mode, minimizationProgress} = props;

  const coordsEasing = Easing.inOut(Easing.quad);
  const coordsDuration = 400;

  const selectedCategoryY = useDerivedValue(() => {
    if (!currentCategoryPosition) {
      return 0;
    }

    return withTiming(
      /*
      minimizationProgress
        ? 55 * minimizationProgress.value - currentCategoryPosition.y
        : 0,
       */
      interpolate(
        minimizationProgress?.value ?? 0,
        [0, 0.1],
        [0, 45 - currentCategoryPosition.y],
        Extrapolate.CLAMP,
      ),
      {
        duration: coordsDuration,
        easing: coordsEasing,
      },
    );
  }, [currentCategoryPosition]);

  const {width} = useWindowDimensions();

  const selectedCategoryX = useDerivedValue(() => {
    if (!currentCategoryPosition) {
      return 0;
    }

    return withTiming(
      interpolate(
        minimizationProgress?.value ?? 0,
        [0, 1],
        [currentCategoryPosition.x, width - 20 - currentCategoryPosition.w],
        Extrapolate.CLAMP,
      ), //- xOffset.value * (1 - (minimizationProgress?.value ?? 0)),
      {
        duration: coordsDuration,
        easing: coordsEasing,
      },
    );
  }, [currentCategoryPosition]);

  const categories = useMemo(() => {
    if (mode === 'create-stream') {
      return useStore.getState().categories.filter(i => i.id !== 'foru');
    }

    return useStore.getState().categories;
  }, []);

  const colors = useMemo(() => {
    const colors = [BASE_COLOR];

    for (let i = 1; i < categories.length; i++) {
      colors.push(
        tinycolor(colors[i - 1].toHexString()).spin(
          360 / (categories.length - 1),
        ),
      );
    }

    return colors;
  }, [categories]);

  const renderItem = useCallback(
    (category: IStreamCategory, index: number) => {
      const isSelected =
        useStore.getState().selectedFeedCategory?.id === category.id;

      return (
        <StreamCategoryOption
          key={category.id}
          selected={isSelected}
          color={colors[index].toHexString()}
          category={category}
          onPress={p => {
            setCurrentCategoryPosition(p);
            selectedIndex.current = index;
            useStore.getState().dispatchFeedCategoryChange(category);
          }}
        />
      );
    },
    [categories, mode, streamCategory],
  );

  const fakeCategoryStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: selectedCategoryX.value,
    top: selectedCategoryY.value,
    transform: [{translateX: -xOffset.value}],
  }));

  const fakeCategoryWrapper = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    transform: [
      {
        translateX: withTiming(
          xOffset.value * (minimizationProgress?.value ?? 1),
          {duration: coordsDuration, easing: coordsEasing},
        ),
      },
    ],
  }));

  const scrollViewStyle = useAnimatedStyle(() => ({
    opacity: withDelay(
      300,
      withTiming(
        interpolate(
          minimizationProgress?.value ?? 0,
          [0, 0.2],
          [1, 0],
          Extrapolate.CLAMP,
        ),
        {duration: 100},
      ),
    ),
  }));

  const handler = useAnimatedScrollHandler({
    onScroll: e => {
      xOffset.value = e.contentOffset.x;
    },
  });

  return (
    <View {...props} style={[styles.wrapper, props.style]}>
      <Animated.ScrollView
        style={scrollViewStyle}
        //scrollEnabled={!moveCurrentCategory}
        onScroll={handler}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        centerContent
        horizontal
        contentContainerStyle={styles.container}>
        {categories.map(renderItem)}
      </Animated.ScrollView>

      {streamCategory && (
        <Animated.View pointerEvents="box-none" style={fakeCategoryWrapper}>
          <Animated.View style={fakeCategoryStyle}>
            <StreamCategoryOption
              selected
              color={colors[selectedIndex.current].toHexString()}
              category={streamCategory}
              onPress={() => {}}
            />
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  wrapper: {
    overflow: 'visible',
    paddingBottom: 10,
  },
});
