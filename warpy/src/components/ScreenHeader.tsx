import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from './Text';
import {OpenNotificationsButton} from './OpenNotificationsButton';
import {SearchButton} from './SearchButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Avatar} from './Avatar';
import {OpenHomeButton} from './OpenHomeButton';
import {UserList} from '@warpy/lib';
import {useStore} from '@app/store';

export const ScreenHeader = () => {
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
      following: '/following',
      followers: '/followers',
      blocked: '/blocked',
    };

    const titles = {
      MyAwardsDisplay: '/awards',
      Feed: '/feed',
      Notifications: '/news',
      MainSettingsScreen: '/you',
      User: '/user',
      UserListScreen: userListScreenTitles[userListScreenMode],
      SendInvite: '/invite people',
      InviteCodeInput: '/invite',
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
    //navigation.navigate('NewStream');
  }, [navigation]);

  const onOpenFeed = useCallback(() => {
    navigation.navigate('Feed');
  }, [navigation]);

  const button = useMemo(
    () =>
      route.name === 'Feed' ? (
        <OpenNotificationsButton
          style={styles.headerButton}
          onPress={onOpenNotifications}
        />
      ) : (
        <OpenHomeButton style={styles.headerButton} onPress={onOpenFeed} />
      ),
    [route.name],
  );

  return (
    <View style={styles.header}>
      <Text size="large" weight="extraBold">
        {title}
      </Text>
      {displayControls && (
        <View style={styles.row}>
          {button}

          <SearchButton style={styles.headerButton} onPress={onSearch} />
          {user && (
            <TouchableOpacity onPress={onOpenSettings}>
              {/* uh oh 🤡 */}
              <Avatar user={user ? user : ({avatar: signUpAvatar} as any)} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 10,
  },
});
