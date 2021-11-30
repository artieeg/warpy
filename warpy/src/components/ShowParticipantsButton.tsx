import {useStore} from '@warpy/store';
import React from 'react';
import {RoundButton} from './RoundButton';
import {Text} from './Text';

export const ShowParticipantsButton = (props: {style: any}) => {
  const count = useStore.use.totalParticipantCount();
  const dispatchModalOpen = useStore.use.dispatchModalOpen();

  return (
    <RoundButton {...props} onPress={() => dispatchModalOpen('participants')}>
      <Text color="white" weight="bold" size="small">
        {count.toString()}
      </Text>
    </RoundButton>
  );
};
