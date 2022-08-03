import React, {useMemo} from 'react';
import {FriendFeed, StreamFeedView} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {StreamCategoryList} from '@app/components/StreamCategoryList';
import {useFeed} from '@app/hooks';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {TextButton} from '@warpy/components';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useAnimatedScrollHandler,
  useSharedValue,
  Layout,
} from 'react-native-reanimated';

export const Feed: React.FC = () => {
  const {
    feed: _feed,
    initialFeedFetchDone,
    isFeedLoading,
    refreshFeed,
  } = useFeed();
  const navigation = useNavigation();

  const feed = useMemo(
    () => [
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
      ..._feed,
    ],
    [_feed],
  );

  const onStartStream = React.useCallback(() => {
    navigation.navigate('NewStream');
  }, [navigation]);

  const scrollY = useSharedValue(0);

  const categoryListHeight = useSharedValue(0);
  const friendFeedHeight = useSharedValue(0);

  const streamFeedViewWrapperStyle = useAnimatedStyle(
    () => ({
      marginBottom: -(categoryListHeight.value + 10 + friendFeedHeight.value),

      transform: [
        {
          translateY: withTiming(
            scrollY.value > 0.5
              ? -1 * (categoryListHeight.value + 10 + friendFeedHeight.value)
              : 0,
            {duration: 300},
          ),
        },
      ],

      flex: 1,
    }),
    [categoryListHeight, scrollY, friendFeedHeight],
  );

  const {height} = useWindowDimensions();

  const handler = useAnimatedScrollHandler(
    {
      onScroll: e => {
        const dy = e.velocity?.y ?? 0;
        if (e.contentOffset.y < height / 6) {
          return;
        }

        scrollY.value +=
          dy / (categoryListHeight.value + friendFeedHeight.value);

        if (dy > 0 && scrollY.value > 0.3) {
          scrollY.value = 1;
        }

        if (dy < 0 && scrollY.value < 0.7) {
          scrollY.value = 0;
        }
      },
    },
    [height, categoryListHeight, friendFeedHeight],
  );

  return (
    <View style={styles.wrapper}>
      <ScreenHeader minimizationProgress={scrollY} />
      <Animated.View style={{height: '100%'}} layout={Layout.duration(200)}>
        <FriendFeed
          minimizationProgress={scrollY}
          onLayout={e => {
            friendFeedHeight.value = e.nativeEvent.layout.height;
          }}
        />
        <StreamCategoryList
          minimizationProgress={scrollY}
          onLayout={e => {
            categoryListHeight.value = e.nativeEvent.layout.height;
          }}
          mode="browse-feed"
        />

        <Animated.View style={streamFeedViewWrapperStyle}>
          <StreamFeedView
            scrollEventThrottle={16}
            onRefresh={refreshFeed}
            refreshing={isFeedLoading && initialFeedFetchDone}
            onScroll={handler}
            data={feed}
          />
        </Animated.View>
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
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
