import {ScreenHeader} from '@app/components';
import React from 'react';
import {View, StyleSheet} from 'react-native';

export const InviteCodeInput = () => {
  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
