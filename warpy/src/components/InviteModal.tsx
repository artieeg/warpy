import {useInviteSuggections} from '@app/hooks/useInviteSuggestions';
import React from 'react';
import {FlatList} from 'react-native';
import {Avatar} from './Avatar';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';

export const InviteModal = (props: IBaseModalProps) => {
  const suggestions = useInviteSuggections();

  return (
    <BaseSlideModal {...props}>
      <FlatList
        renderItem={({item}) => <Avatar user={item} />}
        data={suggestions}
      />
    </BaseSlideModal>
  );
};
