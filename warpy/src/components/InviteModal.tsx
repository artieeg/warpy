import {useUserSearch} from '@app/hooks';
import {useInviteSuggestions} from '@app/hooks/useInviteSuggestions';
import React from 'react';
import {FlatList, useWindowDimensions} from 'react-native';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {UserInviteOption} from './UserInviteOption';
import {UserSearchInput} from './UserSearchInput';

export const InviteModal = (props: IBaseModalProps) => {
  const {users: searchedUsers, isLoading, setSearch} = useUserSearch();
  const suggestions = useInviteSuggestions();

  const height = useWindowDimensions().height * 0.9;

  const modalStyle = {maxHeight: height, minHeight: height, height};

  return (
    <BaseSlideModal {...props} style={modalStyle}>
      <UserSearchInput onChangeText={text => setSearch(text)} />

      {searchedUsers.length > 0 && (
        <FlatList
          renderItem={({item}) => <UserInviteOption user={item} />}
          data={searchedUsers}
        />
      )}

      {searchedUsers.length === 0 && !isLoading && (
        <FlatList
          renderItem={({item}) => <UserInviteOption user={item} />}
          data={suggestions}
        />
      )}
    </BaseSlideModal>
  );
};
