import React from 'react';
import {StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {Check} from './icons';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const ConfirmButton = (props: IRoundButtonProps) => {
  return (
    <RoundButton {...props} style={[styles.button, props.style]}>
      <Check fill={colors.black} width={30} height={30} />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#BDF971',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
