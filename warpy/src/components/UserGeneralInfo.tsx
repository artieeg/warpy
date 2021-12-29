import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {IBaseUser} from '@warpy/lib';
import {Avatar, IAvatarProps} from './Avatar';
import {Text} from './Text';

interface UserGeneralInfoProps extends ViewProps {
  user: IBaseUser;
  avatar?: Partial<IAvatarProps>;
}

export const UserGeneralInfo = ({
  user,
  style,
  avatar,
}: UserGeneralInfoProps) => {
  console.log(user);
  return (
    <View style={[styles.avatarAndUserInfo, style]}>
      <View>
        <Avatar size="large" {...avatar} user={user} />
        {typeof user.online !== 'undefined' && (
          <View
            style={[
              styles.indicator,
              user.online ? styles.online : styles.offline,
            ]}
          />
        )}
      </View>
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
  indicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  offline: {
    backgroundColor: '#71B8F9',
  },
  online: {
    backgroundColor: '#BDF971',
  },
  userInfo: {
    paddingLeft: 20,
  },
});
