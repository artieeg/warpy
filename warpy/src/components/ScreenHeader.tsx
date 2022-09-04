import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {OpenNotificationsButton} from './OpenNotificationsButton';
import {SearchButton} from './SearchButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Avatar} from './Avatar';
import {OpenHomeButton} from './OpenHomeButton';
import {UserList} from '@warpy/lib';
import {useStore} from '@app/store';
import {ScreenTitle} from './ScreenTitle';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  Layout,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {InfoHeader} from './InfoHeader';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const ScreenHeader: React.FC<{
  minimizationProgress?: SharedValue<number>;
}> = ({minimizationProgress}) => {
  //TODO: too ugly, change someday
  const [user, signUpAvatar] = useStore(state => [
    state.user,
    state.signUpAvatar,
  ]);

  const navigation = useNavigation();

  const route = useRoute();

  //Used to pick the correct title when the app's on the UserListScreen
  const userListScreenMode: UserList = (route.params as any)?.mode as any;

  const displayControls = useMemo(
    () => !['SendInvite'].includes(route.name),
    [route.name],
  );

  const title = useMemo(() => {
    const userListScreenTitles = {
      following: 'following',
      followers: 'followers',
      blocked: 'blocked',
    };

    const titles = {
      MyAwardsDisplay: 'awards',
      Search: 'search',
      Feed: 'feed',
      Notifications: 'news',
      MainSettingsScreen: 'you',
      User: 'user',
      UserListScreen: userListScreenTitles[userListScreenMode],
      SendInvite: 'invite people',
      InviteCodeInput: 'invite',
      AvatarPickerScreen: 'pick avatar',
    };

    return titles[route.name as keyof typeof titles];
  }, [route.name, userListScreenMode]);

  const onOpenSettings = useCallback(() => {
    navigation.navigate('MainSettingsScreen');
  }, [navigation]);

  const onOpenNotifications = useCallback(() => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const onSearch = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const onOpenFeed = useCallback(() => {
    navigation.navigate('Feed');
  }, [navigation]);

  const firstButton = useMemo(
    () =>
      route.name === 'Feed' || route.name === 'Search' ? (
        <OpenNotificationsButton
          style={styles.headerButton}
          onPress={onOpenNotifications}
        />
      ) : (
        <OpenHomeButton style={styles.headerButton} onPress={onOpenFeed} />
      ),
    [route.name],
  );

  const secondButton = useMemo(
    () =>
      route.name === 'Feed' ||
      route.name === 'Notifications' ||
      route.name === 'MainSettingsScreen' ? (
        <SearchButton style={styles.headerButton} onPress={onSearch} />
      ) : (
        <OpenHomeButton style={styles.headerButton} onPress={onOpenFeed} />
      ),
    [route.name],
  );

  const avatarStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withTiming(
            interpolate(
              minimizationProgress?.value ?? 0,
              [0, 1],
              [1, 0.7],
              Extrapolate.CLAMP,
            ),
            {duration: 300, easing: Easing.ease},
          ),
        },
      ],
    }),
    [minimizationProgress?.value],
  );

  const controlsStyle = useAnimatedStyle(() => ({
    flexDirection: 'row',
    opacity: withTiming(
      minimizationProgress ? 1 - minimizationProgress.value : 1,
      {
        duration: 300,
        easing: Easing.ease,
      },
    ),
  }));

  const headerStyle = useAnimatedStyle(() => ({
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(
          interpolate(
            minimizationProgress?.value ?? 0,
            [0, 1],
            [1, 0.75],
            Extrapolate.CLAMP,
          ),
          {duration: 300, easing: Easing.ease},
        ),
      },
      {
        translateX: withTiming(
          interpolate(
            minimizationProgress?.value ?? 0,
            [0, 1],
            [0, -20],
            Extrapolate.CLAMP,
          ),
          {duration: 300, easing: Easing.ease},
        ),
      },
    ],
  }));

  return (
    <Animated.View layout={Layout.duration(200)}>
      <InfoHeader />
      <Animated.View layout={Layout.duration(200)} style={headerStyle}>
        <Animated.View style={titleStyle}>
          <ScreenTitle>{title}</ScreenTitle>
        </Animated.View>
        <View style={styles.controlsWrapper}>
          <Animated.View style={controlsStyle}>
            {displayControls && (
              <View style={styles.row}>
                {firstButton}

                {secondButton}
              </View>
            )}
          </Animated.View>

          {displayControls && user && (
            <AnimatedTouchableOpacity
              style={avatarStyle}
              onPress={onOpenSettings}>
              {/* uh oh 🤡 */}
              <Avatar user={user ? user : ({avatar: signUpAvatar} as any)} />
            </AnimatedTouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerButton: {
    marginRight: 10,
  },
});
