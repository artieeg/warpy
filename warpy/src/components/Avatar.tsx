import React from 'react';
import {IUser} from '@app/models';
import {Image, StyleSheet} from 'react-native';

interface IAvatarProps {
  user: IUser;
  style?: any;
}

export const Avatar = (props: IAvatarProps) => {
  const {user, style} = props;
  const {avatar} = user;

  return <Image style={[styles.avatar, style]} source={{uri: avatar}} />;
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: '#303030',
    width: 50,
    height: 50,
  },
});
