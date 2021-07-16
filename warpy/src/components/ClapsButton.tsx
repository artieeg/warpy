import React from 'react';
import {Icon} from './Icon';
import {RoundButton} from './RoundButton';

interface IClapButtonProps {
  style?: any;
}

export const ClapButton = (props: IClapButtonProps) => {
  const {style} = props;

  return (
    <RoundButton style={style}>
      <Icon name="claps" size={30} color="#fff" />
    </RoundButton>
  );
};
