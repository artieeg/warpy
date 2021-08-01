import React from 'react';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

interface IOpenStatsButton extends IRoundButtonProps {}

export const OpenStatsButton = (props: IOpenStatsButton) => {
  return (
    <RoundButton {...props}>
      <Icon name="chart" size={30} color="#EEE5E9" />
    </RoundButton>
  );
};
