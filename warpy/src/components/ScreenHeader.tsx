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

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      minimizationProgress ? 1 - minimizationProgress.value : 1,
      {
        duration: 300,
        easing: Easing.ease,
      },
    ),
    transform: [
      {
        scale: withTiming(
          interpolate(
            minimizationProgress?.value ?? 0,
            [0, 1],
            [1, 0.3],
            Extrapolate.CLAMP,
          ),
          {duration: 300, easing: Easing.ease},
        ),
      },
    ],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: withTiming(
      minimizationProgress ? 10 + (1 - minimizationProgress.value) * 10 : 20,
      {
        duration: 300,
        easing: Easing.ease,
      },
    ),
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
        <Animated.View style={controlsStyle}>
          {displayControls && (
            <View style={styles.row}>
              {firstButton}

              {secondButton}
              {user && (
                <TouchableOpacity onPress={onOpenSettings}>
                  {/* uh oh 🤡 */}
                  <Avatar
                    user={user ? user : ({avatar: signUpAvatar} as any)}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </Animated.View>
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
  headerButton: {
    marginRight: 10,
  },
});
