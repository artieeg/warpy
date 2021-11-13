import {ScreenHeader} from '@app/components/ScreenHeader';
import React from 'react';
import {View, StyleSheet} from 'react-native';

export const MainSettingsScreen = () => {
  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    flex: 1,
  },
});
