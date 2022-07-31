import {useStoreShallow} from '@app/store';
import React, {useMemo} from 'react';
import {StyleSheet, FlatList, ViewProps} from 'react-native';
import {FriendFeedItem} from '@warpy/lib';
import {UserHorizontalListItem} from './UserHorizontalListItem';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface FriendFeedProps extends ViewProps {
  minimizationProgress: SharedValue<number>;
}

export const FriendFeed: React.FC<FriendFeedProps> = ({
  minimizationProgress,
  ...props
}) => {
  const [friendFeed, following] = useStoreShallow(state => [
    state.friendFeed,
    state.list_following.list,
    //state.list_following.list,
  ]);

  const feed: FriendFeedItem[] = useMemo(
    () => [
      ...friendFeed,
      ...following
        .filter(
          followedUser =>
            !friendFeed.find(item => item.user.id === followedUser.id),
        )
        .map(user => ({user, stream: undefined})),
    ],
    [friendFeed, following],
  );

  if (feed.length === 0) {
    return null;
  }

  const wrapperStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1 - minimizationProgress.value, {
        duration: 300, //300,
        easing: Easing.ease,
      }),

      transform: [
        {
          translateY: withTiming(
            interpolate(
              minimizationProgress.value,
              [0, 1],
              [0, -20],
              Extrapolate.CLAMP,
            ),
            {duration: 300, easing: Easing.ease},
          ),

          /*
          scale: withTiming(
            interpolate(
              minimizationProgress.value,
              [0, 1],
              [1, 0.95],
              Extrapolate.CLAMP,
            ),
            {duration: 300, easing: Easing.ease},
          ),
           */
        },
      ],
    };
  }, [minimizationProgress]);

  return (
    <Animated.View {...props} style={wrapperStyle}>
      <FlatList
        horizontal
        data={feed}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <UserHorizontalListItem key={item.user.id} item={item} />
        )}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
    paddingLeft: 20,
  },
});
