import React from 'react';
import {IUser} from '@app/models';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

interface IAvatarProps {
  user: IUser;
  style?: any;
  size?: 'small' | 'medium' | 'large';
}

export const Avatar = (props: IAvatarProps) => {
  const {user, size, style} = props;
  const {avatar} = user;

  return (
    <FastImage
      style={[styles.avatar, styles[size || 'medium'], style]}
      source={{uri: avatar}}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    borderRadius: 40,
    backgroundColor: '#303030',
  },
  small: {
    width: 40,
    height: 40,
  },
  medium: {
    width: 50,
    height: 50,
  },
  large: {
    width: 80,
    height: 80,
  },
});
