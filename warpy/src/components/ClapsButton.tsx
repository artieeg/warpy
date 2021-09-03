import React from 'react';
import {Reaction} from './Reaction';
import {IRoundButtonProps, RoundButton} from './RoundButton';

interface IClapButtonProps extends IRoundButtonProps {
  reaction: string;
}

export const ClapButton = (props: IClapButtonProps) => {
  const {reaction} = props;

  return (
    <RoundButton {...props}>
      <Reaction code={reaction} />
    </RoundButton>
  );
};
