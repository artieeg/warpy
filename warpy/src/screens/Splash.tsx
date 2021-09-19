import {useAppSetUp} from '@app/hooks';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Splash = () => {
  useAppSetUp();

  return (
    <View style={styles.screen}>
      <Text>Logo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
