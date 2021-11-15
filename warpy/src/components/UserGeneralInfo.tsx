import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {IUser} from '@warpy/lib';
import {Avatar, IAvatarProps} from './Avatar';
import {Text} from './Text';

interface UserGeneralInfoProps extends ViewProps {
  user: IUser;
  avatar?: Partial<IAvatarProps>;
}

export const UserGeneralInfo = ({
  user,
  style,
  avatar,
}: UserGeneralInfoProps) => {
  return (
    <View style={[styles.avatarAndUserInfo, style]}>
      <Avatar size="large" {...avatar} user={user} />
      <View style={styles.userInfo}>
        <Text weight="bold">{user.first_name}</Text>
        <Text color="info" weight="bold" size="small">
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
