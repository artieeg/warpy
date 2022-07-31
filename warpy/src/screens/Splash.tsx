import {LoadingOverlay} from '@app/components';
import {useAppSetUp} from '@app/hooks';
import React from 'react';
import {View, StyleSheet} from 'react-native';

export const Splash = () => {
  //useAppSetUp();

  return (
    <View style={styles.screen}>
      <LoadingOverlay mode="splash" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000',
  },
});
