import {useStore} from '@app/store';
import React from 'react';
import {RoundButton} from './RoundButton';
import {Text} from './Text';

export const ShowParticipantsButton = (props: {style: any}) => {
  const count = useStore.use.totalParticipantCount();
  const openNewModal = useStore.use.openNewModal();

  return (
    <RoundButton {...props} onPress={() => openNewModal('participants')}>
      <Text color="white" weight="bold" size="small">
        {count.toString()}
      </Text>
    </RoundButton>
  );
};
