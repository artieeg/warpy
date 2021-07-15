import React from 'react';
import {StyleSheet} from 'react-native';
import {RoundButton} from './RoundButton';

export const StopStream = () => {
  return <RoundButton style={styles.stop} />;
};

const styles = StyleSheet.create({
  stop: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
});
