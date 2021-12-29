import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IBaseUser} from '@warpy/lib';

export interface IAvatarProps {
  user: IBaseUser;
  style?: any;
  size?: keyof typeof sizeStyles;
  useRNImage?: boolean;
}

export const Avatar = (props: IAvatarProps) => {
  const {user, size, style, useRNImage} = props;
  const {avatar} = user;

  const indicator =
    typeof user.online !== 'undefined' ? (
      <View
        style={[styles.indicator, user.online ? styles.online : styles.offline]}
      />
    ) : null;

  if (useRNImage) {
    return (
      <View>
        <Image
          style={[styles.avatar, sizeStyles[size || 'medium'], style]}
          source={{uri: avatar}}
        />
        {indicator}
      </View>
    );
  }

  return (
    <View>
      <FastImage
        style={[styles.avatar, sizeStyles[size || 'medium'], style]}
        source={{uri: avatar}}
      />
      {indicator}
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
    width: 60,
    height: 60,
  },
  xlarge: {
    width: 80,
    height: 80,
  },
  xxlarge: {
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
});
