import {useInviteModalController} from '@app/hooks/useInviteModalController';
import React from 'react';
import {FlatList} from 'react-native';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {UserInviteOption} from './UserInviteOption';
import {UserSearchInput} from './UserSearchInput';

export const InviteModal = (props: IBaseModalProps) => {
  const {
    modalHeight,
    searchedUsers,
    inviteSuggestions,
    isLoading,
    setSearchQuery,
  } = useInviteModalController();

  const modalStyle = {
    height: modalHeight,
  };

  return (
    <BaseSlideModal {...props} style={modalStyle}>
      <UserSearchInput onChangeText={text => setSearchQuery(text)} />

      {searchedUsers.length > 0 && (
        <FlatList
          renderItem={({item}) => <UserInviteOption user={item} />}
          data={searchedUsers}
        />
      )}

      {searchedUsers.length === 0 && !isLoading && (
        <FlatList
          renderItem={({item}) => <UserInviteOption user={item} />}
          data={inviteSuggestions}
        />
      )}
    </BaseSlideModal>
  );
};
