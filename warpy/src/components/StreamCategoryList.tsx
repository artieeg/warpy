import {useStore} from '@app/store';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ViewProps,
  useWindowDimensions,
} from 'react-native';
import {StreamCategoryOption} from './StreamCategoryOption';
import tinycolor from 'tinycolor2';
import {IStreamCategory} from '@warpy/lib';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const BASE_COLOR = tinycolor('F9AA71');

interface StreamCategoryListProps extends ViewProps {
  mode?: 'create-stream' | 'browse-feed';
  hidden?: boolean;
  moveCurrentCategory?: boolean;
}

export const StreamCategoryList: React.FC<StreamCategoryListProps> = props => {
  const offset = useRef<number>(0);
  const selectedIndex = useRef<number>(0);
  const [currentCategoryPosition, setCurrentCategoryPosition] =
    useState<{x: number; y: number; w: number}>();

  const {mode, hidden, moveCurrentCategory} = props;

  const streamCategory = useStore(state => state.selectedFeedCategory);

  const selectedCategoryY = useDerivedValue(() => {
    if (!currentCategoryPosition) {
      return 0;
    }

    return withTiming(
      moveCurrentCategory ? 35 - currentCategoryPosition.y : 0,
      {
        duration: 200,
        easing: Easing.ease,
      },
    );
  }, [currentCategoryPosition, moveCurrentCategory]);

  const {width} = useWindowDimensions();

  const selectedCategoryX = useDerivedValue(() => {
    if (!currentCategoryPosition) {
      return 0;
    }

    return withTiming(
      moveCurrentCategory
        ? width - 20 - currentCategoryPosition.w
        : currentCategoryPosition.x,
      {
        duration: 200,
        easing: Easing.ease,
      },
    );
  }, [currentCategoryPosition, moveCurrentCategory]);

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
    //opacity: moveCurrentCategory ? 1 : 0,
    left: selectedCategoryX.value,
    top: selectedCategoryY.value,
  }));

  const scrollViewStyle = useAnimatedStyle(() => ({
    opacity: withDelay(
      moveCurrentCategory ? 0 : 200,
      withTiming(moveCurrentCategory ? 0 : 1, {duration: 100}),
    ),
  }));

  return (
    <View style={[styles.wrapper, props.style]}>
      <Animated.ScrollView
        style={scrollViewStyle}
        scrollEnabled={!moveCurrentCategory}
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
