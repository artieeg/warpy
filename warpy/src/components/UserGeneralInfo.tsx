import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {IBaseUser} from '@warpy/lib';
import {Avatar, IAvatarProps} from './Avatar';
import {Text} from './Text';

interface UserGeneralInfoProps extends ViewProps, IAvatarProps {
  user: IBaseUser;
}

export const UserGeneralInfo = (props: UserGeneralInfoProps) => {
  return (
    <View style={[styles.avatarAndUserInfo, props.style]}>
      <Avatar size="xlarge" {...props} style={{}} />
      <View style={styles.userInfo}>
        <Text weight="bold">{props.user.first_name}</Text>
        <Text color="boulder" weight="bold" size="small">
          @{props.user.username}
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
