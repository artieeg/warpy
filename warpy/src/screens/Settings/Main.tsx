import {Avatar, SettingsTextEdit, Text} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {useStore} from '@app/store';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IUser} from '@warpy/lib';

export const MainSettingsScreen = () => {
  const user: IUser = useStore(store => store.user) as IUser;

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <View style={styles.avatarContainer}>
        <Avatar user={user} size="xlarge" />
        <Text
          weight="bold"
          size="small"
          color="info"
          style={styles.avatarChangeHint}>
          tap to change{'\n'}your pfp
        </Text>
      </View>
      <View style={styles.padding}>
        <SettingsTextEdit placeholder="name" field="first_name" />
        <SettingsTextEdit placeholder="username" field="username" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  padding: {
    paddingHorizontal: 30,
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
