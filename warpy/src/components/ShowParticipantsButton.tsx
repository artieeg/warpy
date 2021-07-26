import React from 'react';
import {RoundButton} from './RoundButton';
import {Text} from './Text';

interface IShowParticipantsProps {
  count: number;
  style?: any;
  onOpenParticipantsList: () => any;
}

export const ShowParticipantsButton = (props: IShowParticipantsProps) => {
  const {style, count, onOpenParticipantsList} = props;

  return (
    <RoundButton onPress={onOpenParticipantsList} style={style}>
      <Text weight="bold" size="small">
        {count.toString()}
      </Text>
    </RoundButton>
  );
};
