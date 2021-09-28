import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {RoundButton, IRoundButtonProps} from './RoundButton';

export const InviteUserButton = (props: IRoundButtonProps) => {
  return (
    <RoundButton {...props} style={[props.style, styles.button]}>
      <Icon name="plus" size={24} color="#BDF971" />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#202020',
  },
});
