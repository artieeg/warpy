import {FriendFeed, StreamFeedView} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {StreamCategoryList} from '@app/components/StreamCategoryList';
import {useFeed} from '@app/hooks';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {TextButton} from '@warpy/components';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  event,
  useAnimatedScrollHandler,
  useSharedValue,
  add,
  set,
  interpolate,
  Extrapolation,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';

export const Feed = () => {
  const feed = useFeed();
  const navigation = useNavigation();

  const onStartStream = React.useCallback(() => {
    navigation.navigate('NewStream');
  }, [navigation]);

  const [isMinimized, setMinimized] = useState(false);

  const scrollY = useSharedValue(0);

  const [categoryListHeight, setCategoryListHeight] = useState(0);

  /*
  const minimizationProgress = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, categoryListHeight + 10], [0, 1]);
  }, [categoryListHeight]);
   */

  const feedWrapperStyle = useAnimatedStyle(() => ({
    //marginTop: withTiming(-scrollY.value, {duration: 300}),
    marginTop: withTiming(-1 * scrollY.value * (categoryListHeight + 10), {
      duration: 300,
    }),
    flex: 1,
  }));

  const {height} = useWindowDimensions();

  const handler = useAnimatedScrollHandler(
    {
      onScroll: e => {
        const dy = e.velocity?.y ?? 0;

        /*
        if (dy > 0 && scrollY.value < categoryListHeight) {
          console.log(dy);
          scrollY.value += dy;
        }

        if (dy < 0 && scrollY.value > 0) {
          console.log(dy);
          scrollY.value += dy;
        }
         */

        if (e.contentOffset.y < height / 6) {
          return;
        }

        scrollY.value += dy / categoryListHeight;

        if (dy > 0 && scrollY.value > 0.3) {
          //if (scrollY.value > categoryListHeight) {
          scrollY.value = 1;
        }

        if (dy < 0 && scrollY.value < 0.7) {
          //if (scrollY.value < 0) {
          scrollY.value = 0;
        }
        //*/
      },
    },
    [categoryListHeight, height],
  );

  return (
    <View style={styles.wrapper}>
      <ScreenHeader minimizationProgress={scrollY} />
      <FriendFeed />
      <StreamCategoryList
        minimizationProgress={scrollY}
        onLayout={e => setCategoryListHeight(e.nativeEvent.layout.height)}
        mode="browse-feed"
      />

      <Animated.View style={feedWrapperStyle}>
        <StreamFeedView
          scrollEventThrottle={16}
          onScroll={handler}
          data={feed}
          //style={{marginTop: -categoryListHeight - 10, zIndex: -10}}
          //contentContainerStyle={{paddingTop: categoryListHeight + 10}}
        />
      </Animated.View>
      <View style={styles.startStreamButtonWrapper}>
        <TextButton
          style={{alignSelf: 'center'}}
          containerStyle={{paddingHorizontal: 30}}
          onPress={onStartStream}
          title="start a room"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    flex: 1,
  },
  startStreamButtonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
