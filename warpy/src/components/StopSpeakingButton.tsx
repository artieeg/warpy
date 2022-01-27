import React from 'react';
import {HandWave} from './icons';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const StopSpeakingButton = (props: IRoundButtonProps) => {
  return (
    <RoundButton {...props}>
      <HandWave width={30} height={30} fill="#ffffff" />
    </RoundButton>
  );
};
