import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {RoundButton} from './RoundButton';

export const StopStream = () => {
  return (
    <RoundButton style={styles.stop}>
      <Icon color="#ffffff" size={30} name="stop" />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  stop: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
});
