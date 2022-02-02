import {ScreenHeader} from '@app/components';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../../colors';

export const Search = () => {
  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
