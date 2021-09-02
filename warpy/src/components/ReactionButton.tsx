import React from 'react';
import {View} from 'react-native';
import {IReactionProps, Reaction} from './Reaction';
import {RoundButton} from './RoundButton';

interface IReactionButtonProps extends IReactionProps {
  onPress: () => void;
}

export const ReactionButton = (props: IReactionButtonProps) => {
  return (
    <RoundButton {...props} style={{backgroundColor: '#202020'}}>
      <Reaction {...props} />
    </RoundButton>
  );
};
