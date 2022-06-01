import React from 'react';
import {IReactionProps, Reaction} from './Reaction';
import {RoundButton} from './RoundButton';

interface IReactionOptionButtonProps extends IReactionProps {
  onPress: () => void;
  style?: any;
}

export const ReactionOptionButton = (props: IReactionOptionButtonProps) => {
  return (
    <RoundButton {...props} style={[{backgroundColor: '#202020'}, props.style]}>
      <Reaction {...props} />
    </RoundButton>
  );
};
