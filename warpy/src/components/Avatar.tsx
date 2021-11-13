import React from 'react';
import {IUser} from '@app/models';
import {StyleSheet, Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';

interface IAvatarProps {
  user: IUser;
  style?: any;
  size?: keyof typeof sizeStyles;
  useRNImage?: boolean;
}

export const Avatar = (props: IAvatarProps) => {
  const {user, size, style, useRNImage} = props;
  const {avatar} = user;

  if (useRNImage) {
    return (
      <Image
        style={[styles.avatar, sizeStyles[size || 'medium'], style]}
        source={{uri: avatar}}
      />
    );
  }

  return (
    <View>
      <FastImage
        style={[styles.avatar, sizeStyles[size || 'medium'], style]}
        source={{uri: avatar}}
      />
      <View style={styles.hack} />
    </View>
  );
};

const sizeStyles = StyleSheet.create({
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
  xlarge: {
    width: 100,
    height: 100,
  },
});

const styles = StyleSheet.create({
  hack: {
    zIndex: 10,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  avatar: {
    overflow: 'hidden',
    borderRadius: 60,
    backgroundColor: '#303030',
  },
});
