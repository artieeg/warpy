import {useStore} from '@app/store';
import React from 'react';
import {Reaction} from './Reaction';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const ClapButton = (props: IRoundButtonProps) => {
  const reaction = useStore.use.reaction();

  return (
    <RoundButton {...props}>
      <Reaction code={reaction} />
    </RoundButton>
  );
};
