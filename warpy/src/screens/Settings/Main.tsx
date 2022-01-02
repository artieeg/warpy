import {Avatar, SettingsTextEdit, Text} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {useStoreShallow} from '@app/store';
import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {IUser} from '@warpy/lib';
import {SettingItemButton} from '@app/components/SettingItemButton';
import {navigation} from '@app/navigation';

export const MainSettingsScreen = () => {
  const [user, hasActivatedAppInvite] = useStoreShallow(store => [
    store.user as IUser,
    store.hasActivatedAppInvite,
  ]);

  const settings = useMemo(
    () =>
      getItems({
        onFeedback: () => console.log('not implemented'),
        onLogOut: () => console.log('not implemented'),
        onDeleteAccount: () => console.log('not implemented'),
      }),
    [navigation],
  );

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <ScrollView>
        <View style={styles.avatarContainer}>
          <Avatar user={user} size="xxlarge" />
          <Text
            weight="bold"
            size="small"
            color="boulder"
            style={styles.avatarChangeHint}>
            tap to change{'\n'}your pfp
          </Text>
        </View>
        <View style={styles.padding}>
          <SettingsTextEdit placeholder="name" field="first_name" />
          <SettingsTextEdit placeholder="username" field="username" />
        </View>
        <View style={styles.padding}>
          {Object.entries(settings).map(([key, item]) =>
            key === 'apply_invite' && hasActivatedAppInvite ? null : (
              <SettingItemButton {...item} />
            ),
          )}
        </View>
      </ScrollView>
    </View>
  );
};

type SettingItemsParams = {
  onFeedback: () => any;
  onLogOut: () => any;
  onDeleteAccount: () => any;
};

const getItems = ({
  onFeedback,
  onLogOut,
  onDeleteAccount,
}: SettingItemsParams) => ({
  apply_invite: {
    color: '#CD71F9',
    icon: 'hand-coin',
    title: 'apply invite and get coins',
    onPress: () =>
      navigation.current?.navigate('InviteCodeInput', {mode: 'settings'}),
  },
  send_app_invite: {
    color: '#71F9D8',
    icon: 'invite-user',
    title: 'invite & get coins',
    onPress: () => navigation.current?.navigate('SendInvite'),
  },
  received_awards: {
    color: '#7176F9',
    icon: 'gift',
    title: 'my awards',
    onPress: () => navigation.current?.navigate('MyAwardsDisplay'),
  },
  followers: {
    color: '#F9B271',
    icon: 'account-group',
    title: "people i'm following",
    onPress: () =>
      navigation.current?.navigate('UserListScreen', {mode: 'following'}),
  },
  following: {
    color: '#71B8F9',
    icon: 'account-group',
    title: 'my followers',
    onPress: () =>
      navigation.current?.navigate('UserListScreen', {mode: 'followers'}),
  },
  feedback: {
    color: '#F6F971',
    icon: 'chat',
    title: 'share feedback',
    onPress: () => onFeedback(),
  },
  privacy: {
    color: '#D671F9',
    icon: 'lock-open-variant',
    title: 'privacy',
    onPress: () => console.log('not implemented'),
  },
  blocked: {
    color: '#71F1F9',
    icon: 'account-cancel',
    title: 'blocked users',
    onPress: () =>
      navigation.current?.navigate('UserListScreen', {mode: 'blocked'}),
  },
  logout: {
    color: '#F97971',
    icon: 'logout',
    title: 'log out',
    onPress: () => onLogOut(),
  },
  delete_account: {
    color: '#F97971',
    icon: 'eraser',
    title: 'delete all my data',
    onPress: () => onDeleteAccount(),
  },
});

const styles = StyleSheet.create({
  padding: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wrapper: {
    backgroundColor: '#000',
    flex: 1,
  },
  avatarChangeHint: {
    marginTop: 10,
    textAlign: 'center',
  },
});
