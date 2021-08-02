import React from 'react';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const StopSpeakingButton = (props: IRoundButtonProps) => {
  return (
    <RoundButton {...props}>
      <Icon name="hello" size={30} color="#fff" />
    </RoundButton>
  );
};
