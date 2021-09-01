import React from 'react';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const ClapButton = (props: IRoundButtonProps) => {
  return (
    <RoundButton {...props}>
      <Icon name="claps" size={30} color="#fff" />
    </RoundButton>
  );
};
