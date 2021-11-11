import {useInviteModalController} from '@app/hooks/useInviteModalController';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {IconButton} from './IconButton';
import {TextButton} from './TextButton';
import {UserInviteOption} from './UserInviteOption';
import {UserSearchInput} from './UserSearchInput';

export const InviteModal = (props: IBaseModalProps) => {
  const {
    modalHeight,
    searchedUsers,
    inviteSuggestions,
    isLoading,
    visible,
    setSearchQuery,
    pendingInviteCount,
    sendPendingInvites,
  } = useInviteModalController();

  const modalStyle = {
    height: modalHeight,
  };

  return (
    <BaseSlideModal
      {...props}
      visible={visible}
      disableHideHandler
      style={modalStyle}>
      <View style={styles.header}>
        <UserSearchInput
          style={styles.input}
          onChangeText={text => setSearchQuery(text)}
        />
        <IconButton name="close" size={20} color="#fff" style={styles.close} />
      </View>

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
      <View style={styles.button}>
        <TextButton
          onPress={sendPendingInvites}
          disabled={pendingInviteCount === 0}
          title={
            pendingInviteCount === 0
              ? 'select people to invite'
              : `invite ${pendingInviteCount} ${
                  pendingInviteCount === 1 ? 'person' : 'people'
                }`
          }
        />
      </View>
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginRight: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  close: {
    backgroundColor: '#373131',
  },
  button: {
    position: 'absolute',
    paddingBottom: 15,
    backgroundColor: '#000',
    bottom: 0,
    left: 30,
    right: 30,
  },
});
