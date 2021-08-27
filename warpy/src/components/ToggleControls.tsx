import React from 'react';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

interface IToggleControlsProps extends IRoundButtonProps {
  show: boolean;
}

export const ToggleControls = (props: IToggleControlsProps) => {
  const {show} = props;

  return (
    <RoundButton {...props}>
      <Icon name={show ? 'eye-off' : 'eye'} size={30} color="#fff" />
    </RoundButton>
  );
};
