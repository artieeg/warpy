import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '@app/components';

export const SignUpAvatar = () => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.space} size="large" weight="extraBold">
        /join
      </Text>

      <View style={styles.user}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  space: {
    marginBottom: 20,
  },
  confirm: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  user: {
    flexDirection: 'row',
  },
});
