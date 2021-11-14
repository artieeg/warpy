import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {IUser} from '@warpy/lib';
import {Avatar} from './Avatar';
import {Text} from './Text';

interface UserGeneralInfoProps extends ViewProps {
  user: IUser;
}

export const UserGeneralInfo = ({user, style}: UserGeneralInfoProps) => {
  return (
    <View style={[styles.avatarAndUserInfo, style]}>
      <Avatar size="large" user={user} />
      <View style={styles.userInfo}>
        <Text weight="bold">{user.first_name}</Text>
        <Text color="info" weight="bold" size="xsmall">
          {user.username}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarAndUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    paddingLeft: 20,
  },
});
