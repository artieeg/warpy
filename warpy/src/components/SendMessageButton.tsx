import React from 'react';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const SendMessageButton = (props: IRoundButtonProps) => {
  return (
    <RoundButton {...props}>
      <Icon name="send" size={24} color="#BDF971" />
    </RoundButton>
  );
};
