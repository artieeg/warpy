import React from 'react';
import {View} from 'react-native';
import {IReactionProps, Reaction} from './Reaction';
import {RoundButton} from './RoundButton';

interface IReactionButtonProps extends IReactionProps {
  onPress: () => void;
  style?: any;
}

export const ReactionButton = (props: IReactionButtonProps) => {
  return (
    <RoundButton {...props} style={[{backgroundColor: '#202020'}, props.style]}>
      <Reaction {...props} />
    </RoundButton>
  );
};
