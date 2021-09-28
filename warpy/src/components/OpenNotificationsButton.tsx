import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const OpenNotificationsButton = (props: IRoundButtonProps) => {
  const {style} = props;

  return (
    <RoundButton {...props} style={[style, styles.button]}>
      <Icon name="bell-outline" size={24} color="#BDF971" />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#202020',
  },
});
