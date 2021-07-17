import React from 'react';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const RaiseHandButton = (props: IRoundButtonProps) => {
  return (
    <RoundButton {...props}>
      <Icon name="hand" size={30} color="#fff" />
    </RoundButton>
  );
};
