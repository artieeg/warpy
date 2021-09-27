import {useInviteSuggections} from '@app/hooks/useInviteSuggestions';
import React from 'react';
import {FlatList} from 'react-native';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {UserInviteOption} from './UserInviteOption';

export const InviteModal = (props: IBaseModalProps) => {
  const suggestions = useInviteSuggections();

  return (
    <BaseSlideModal {...props}>
      <FlatList
        renderItem={({item}) => <UserInviteOption user={item} />}
        data={suggestions}
      />
    </BaseSlideModal>
  );
};
