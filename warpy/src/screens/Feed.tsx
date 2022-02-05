import {FriendFeed, StreamFeedView} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {StreamCategoryList} from '@app/components/StreamCategoryList';
import {useFeed} from '@app/hooks';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
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

  const feedWrapperStyle = useAnimatedStyle(() => ({
    marginTop: withTiming(-scrollY.value, {duration: 300}),
    flex: 1,
  }));

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
        scrollY.value += dy;

        if (dy > 0 && scrollY.value > categoryListHeight * 0.3) {
          //if (scrollY.value > categoryListHeight) {
          scrollY.value = categoryListHeight;
        }

        if (dy < 0 && scrollY.value < categoryListHeight * 0.7) {
          //if (scrollY.value < 0) {
          scrollY.value = 0;
        }
        //*/
      },
    },
    [categoryListHeight],
  );

  return (
    <View style={styles.wrapper}>
      <ScreenHeader minimized={isMinimized} />
      <FriendFeed />
      <StreamCategoryList
        onLayout={e => setCategoryListHeight(e.nativeEvent.layout.height)}
        moveCurrentCategory={isMinimized}
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
        <TextButton onPress={onStartStream} title="start a room now" />
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
