import {useStore} from '@app/store';
import React from 'react';
import {RoundButton} from './RoundButton';
import {Text} from './Text';

interface IShowParticipantsProps {
  count?: number;
  style?: any;
  onOpenParticipantsList: () => any;
}

export const ShowParticipantsButton = (props: IShowParticipantsProps) => {
  const {style, onOpenParticipantsList} = props;

  const count = useStore.use.totalParticipantCount();

  return (
    <RoundButton onPress={onOpenParticipantsList} style={style}>
      <Text color="white" weight="bold" size="small">
        {count.toString()}
      </Text>
    </RoundButton>
  );
};
