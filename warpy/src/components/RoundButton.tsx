import React from 'react';
import {StyleSheet, View} from 'react-native';

interface IRoundButton {
  style?: any;
}

export const RoundButton = ({style}: IRoundButton) => {
  return (
    <View style={[styles.wrapper, style]}>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#011A287F',
  },
});
