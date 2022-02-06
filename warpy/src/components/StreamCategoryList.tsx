import {useStore} from '@app/store';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, ViewProps, useWindowDimensions} from 'react-native';
import {StreamCategoryOption} from './StreamCategoryOption';
import tinycolor from 'tinycolor2';
import {IStreamCategory} from '@warpy/lib';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const BASE_COLOR = tinycolor('F9AA71');

interface StreamCategoryListProps extends ViewProps {
  mode?: 'create-stream' | 'browse-feed';
  minimizationProgress?: SharedValue<number>;
}

export const StreamCategoryList: React.FC<StreamCategoryListProps> = props => {
  const offset = useRef<number>(0);
  const selectedIndex = useRef<number>(0);
  const [currentCategoryPosition, setCurrentCategoryPosition] =
    useState<{x: number; y: number; w: number}>();

  const {mode, minimizationProgress} = props;

  const streamCategory = useStore(state => state.selectedFeedCategory);

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
        [0, 55 - currentCategoryPosition.y],
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
      ),
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
  }));

  const scrollViewStyle = useAnimatedStyle(() => ({
    /*
    opacity: withDelay(
      minimizationProgress?.value === 0 ? 0 : coordsDuration * 0.8,
      withTiming(1 - (minimizationProgress?.value ?? 0), {duration: 100}),
    ),
     */
    //opacity: 1 - (minimizationProgress?.value ?? 0) * 4,
    opacity: interpolate(minimizationProgress?.value ?? 0, [0, 0.2], [1, 0]),
  }));

  return (
    <View {...props} style={[styles.wrapper, props.style]}>
      <Animated.ScrollView
        style={scrollViewStyle}
        //scrollEnabled={!moveCurrentCategory}
        onScroll={e => {
          offset.current = e.nativeEvent.contentOffset.x;
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        centerContent
        horizontal
        contentContainerStyle={styles.container}>
        {categories.map(renderItem)}
      </Animated.ScrollView>

      {streamCategory && (
        <Animated.View style={fakeCategoryStyle}>
          <StreamCategoryOption
            selected
            color={colors[selectedIndex.current].toHexString()}
            category={streamCategory}
            onPress={() => {}}
          />
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
  },
});
