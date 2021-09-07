import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

export interface IRoundButtonProps {
  children?: React.ReactChild;
  style?: any;
  onPress?: any;
}

export const RoundButton = (props: IRoundButtonProps) => {
  const {children, onPress, style} = props;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#011A287F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
