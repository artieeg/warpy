import React from 'react';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const ChatButton = (props: IRoundButtonProps) => {
  return (
    <RoundButton {...props}>
      <Icon name="chat" size={30} color="#fff" />
    </RoundButton>
  );
};
