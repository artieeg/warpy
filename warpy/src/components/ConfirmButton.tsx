import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from './IconButton';
import {IRoundButtonProps} from './RoundButton';

export const ConfirmButton = (props: IRoundButtonProps) => {
  return (
    <IconButton
      {...props}
      style={[styles.button, props.style]}
      name="check"
      size={30}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#BDF971',
  },
});
