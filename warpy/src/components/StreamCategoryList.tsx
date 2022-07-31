import {useDispatcher, useStore, useStoreShallow} from '@app/store';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, ViewProps, useWindowDimensions} from 'react-native';
import {StreamCategoryOption} from './StreamCategoryOption';
import tinycolor from 'tinycolor2';
import {StreamCategory} from '@warpy/lib';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  Layout,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {INFO_HEADER_HEIGHT} from './InfoHeader';

const BASE_COLOR = tinycolor('F9AA71');

interface StreamCategoryListProps extends ViewProps {
  mode?: 'create-stream' | 'browse-feed';
  minimizationProgress?: SharedValue<number>;
}

export const StreamCategoryList: React.FC<StreamCategoryListProps> = props => {
  const {onLayout, mode, minimizationProgress} = props;
  const [listWidth, setListWidth] = useState(0);
  const dispatch = useDispatcher();

  const [streamCategory] = useStoreShallow(state => [
    state.selectedFeedCategory,
  ]);

  //used to adjust absolutely positioned current category according to scroll
  const scrollOffsetX = useSharedValue(0);

  //reset scroll offset when category changes
  useEffect(() => {
    scrollOffsetX.value = 0;
  }, [streamCategory]);

  //used to determine color of currently selected category
  const selectedIndex = useRef<number>(0);

  //position of current category relative to screen
  const [currentCategoryPosition, setCurrentCategoryPosition] = useState<{
    x: number;
    y: number;
    w: number;
  }>();

  console.log({currentCategoryPosition});

  /*
  //animation settings
  const coordsEasing = Easing.inOut(Easing.quad);
  const coordsDuration = 400;

  const [isInfoHeaderVisible] = useStoreShallow(store => [
    !!store.previousStreamData,
  ]);

  //animate current category's y to 35 when minimizing
  const selectedCategoryY = useDerivedValue(() => {
    if (!currentCategoryPosition) {
      return 0;
    }

    return withTiming(
      interpolate(
        minimizationProgress?.value ?? 0,
        [0, 0.1],
        [
          0,
          35 +
            (isInfoHeaderVisible ? INFO_HEADER_HEIGHT : 0) -
            currentCategoryPosition.y,
        ],
        Extrapolate.CLAMP,
      ),
      {
        duration: coordsDuration,
        easing: coordsEasing,
      },
    );
  }, [currentCategoryPosition]);

  const screenWidth = useWindowDimensions().width;

  //animate current category's x to (20 - category component's width)
  const selectedCategoryX = useDerivedValue(() => {
    if (!currentCategoryPosition) {
      return 0;
    }

    return withTiming(
      interpolate(
        minimizationProgress?.value ?? 0,
        [0, 1],
        [
          currentCategoryPosition.x,
          screenWidth - 20 - currentCategoryPosition.w,
        ],
        Extrapolate.CLAMP,
      ),
      {
        duration: coordsDuration,
        easing: coordsEasing,
      },
    );
  }, [currentCategoryPosition]);
   */

  const categories = useMemo(() => {
    if (mode === 'create-stream') {
      return useStore.getState().categories.filter(i => i.id !== 'foru');
    }

    return useStore.getState().categories;
  }, [mode]);

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
  }, [categories, mode]);

  const renderItem = useCallback(
    (category: StreamCategory, index: number) => {
      const isSelected =
        useStore.getState().selectedFeedCategory?.id === category.id;

      const onCategorySelect = (p: {x: number; y: number; w: number}) => {
        setCurrentCategoryPosition(p);
        selectedIndex.current = index;
        dispatch(({feed}) => feed.changeFeedCategory(category));
      };

      return (
        <StreamCategoryOption
          key={category.id}
          selected={isSelected}
          //selected={false}
          //style={{opacity: isSelected ? 0 : 1}} //Hide selected category since we draw a fake component over it
          color={colors[index].toHexString()}
          category={category}
          //Selecting the first category,
          //hacky solution, but this way we get category's position for animations
          onWindowPositionAvailable={index === 0 ? onCategorySelect : undefined}
          onPress={onCategorySelect}
        />
      );
    },
    [categories, mode, streamCategory],
  );

  /*
  //position fake category, adjust according to scroll offset
  const fakeCategoryStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: selectedCategoryX.value,
    top: selectedCategoryY.value,
    transform: [{translateX: -scrollOffsetX.value}],
  }));

  //counteract the scroll offset
  const fakeCategoryWrapper = useAnimatedStyle(
    () => ({
      position: 'absolute',
      left: streamCategory?.id === 'foru' ? 10 : 0,
      top: 0,
      right: 0,
      bottom: 0,
      transform: [
        {
          translateX: withTiming(
            scrollOffsetX.value * (minimizationProgress?.value ?? 1),
            {duration: coordsDuration, easing: coordsEasing},
          ),
        },
      ],
    }),
    [streamCategory],
  );
   */

  //hide scroll view during minimization
  const scrollViewStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(1 - (minimizationProgress?.value ?? 1), {
        duration: 300,
      }),
      transform: [
        {
          translateY: withTiming(
            interpolate(
              minimizationProgress?.value ?? 1,
              [0, 1],
              [0, -20],
              Extrapolate.CLAMP,
            ),
            {duration: 300, easing: Easing.ease},
          ),
        },
      ],
    }),
    [minimizationProgress?.value],
  );

  const handler = useAnimatedScrollHandler(
    {
      onScroll: (e, ctx: any) => {
        const prev = ctx.prev ?? 0;

        //adjust scroll offset
        const dx = e.contentOffset.x - prev;
        scrollOffsetX.value += dx;

        ctx.prev = e.contentOffset.x;
      },
    },
    [listWidth],
  );

  return (
    <Animated.View
      {...props}
      onLayout={e => {
        setListWidth(e.nativeEvent.layout.width);
        onLayout?.(e);
      }}
      style={[styles.wrapper, props.style]}>
      <Animated.ScrollView
        style={scrollViewStyle}
        onScroll={handler}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        centerContent
        horizontal
        contentContainerStyle={styles.container}>
        {categories.map(renderItem)}
      </Animated.ScrollView>

      {/*streamCategory && (
        <Animated.View
          key="current_category"
          pointerEvents="none"
          style={fakeCategoryWrapper}>
          <Animated.View style={fakeCategoryStyle} pointerEvents="auto">
            <StreamCategoryOption
              selected
              color={colors[selectedIndex.current].toHexString()}
              category={streamCategory}
              onPress={() => {
                if (minimizationProgress) {
                  minimizationProgress.value = withTiming(0, {
                    duration: 400,
                    easing: Easing.ease,
                  });
                }
              }}
            />
          </Animated.View>
        </Animated.View>
      ) */}
    </Animated.View>
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
