import React from 'react';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

interface IFlipCameraButton extends IRoundButtonProps {}

export const FlipCameraButton = (props: IFlipCameraButton) => {
  return (
    <RoundButton {...props}>
      <Icon name="toggle-camera" size={30} color="#EEE5E9" />
    </RoundButton>
  );
};
