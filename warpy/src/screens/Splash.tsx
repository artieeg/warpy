import {useAppSetUp} from '@app/hooks';
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

export const Splash = () => {
  useAppSetUp();

  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/logo.png')}
        style={{width: 200, height: 200}}
      />
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
