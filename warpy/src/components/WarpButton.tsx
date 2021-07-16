import React from 'react';
import {Icon} from './Icon';
import {RoundButton} from './RoundButton';

interface IWarpButtonProps {
  style?: any;
}

export const WarpButton = (props: IWarpButtonProps) => {
  const {style} = props;

  return (
    <RoundButton style={style}>
      <Icon name="black-hole" size={30} color="#fff" />
    </RoundButton>
  );
};
