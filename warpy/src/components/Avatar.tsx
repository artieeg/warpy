import React from 'react';
import {IUser} from '@app/models';
import {Image, StyleSheet} from 'react-native';

interface IAvatarProps {
  user: IUser;
  style?: any;
  size?: 'small' | 'medium';
}

export const Avatar = (props: IAvatarProps) => {
  const {user, size, style} = props;
  const {avatar} = user;

  return (
    <Image
      style={[styles.avatar, styles[size || 'medium'], style]}
      source={{uri: avatar}}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: '#303030',
  },
  small: {
    width: 30,
    height: 30,
  },
  medium: {
    width: 50,
    height: 50,
  },
});
