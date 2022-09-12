import React from 'react';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {IconButton} from './IconButton';
import {TextButton} from '@warpy/components';
import {UserInviteOption} from './UserInviteOption';
import {UserSearchInput} from './UserSearchInput';
import {ShareStreamLinkButton} from './ShareStreamLinkButton';
import {useUserSearch} from '@app/hooks';
import {useDispatcher, useStoreShallow} from '@app/store';
import {colors} from '../../colors';
import {useModalRef} from '@app/hooks/useModalRef';

export const useInviteModalController = () => {
  const ref = useModalRef('send-invite');

  const [inviteSuggestions, pendingInviteCount, shouldDisplayInviteButton] =
    useStoreShallow(state => [
      state.inviteSuggestions,
      state.pendingInviteUserIds.length,
      !!state.stream,
    ]);

  const dispatch = useDispatcher();

  const {users: searchedUsers, isLoading, setSearch} = useUserSearch();

  React.useEffect(() => {
    dispatch(({invite}) => invite.fetchInviteSuggestions('test'));
  }, []);

  const modalHeight = useWindowDimensions().height * 0.9;

  const sendPendingInvites = React.useCallback(() => {
    ref.current?.close();

    dispatch(({invite}) => {
      invite.sendPendingInvites();
    });
  }, [dispatch]);

  return {
    modalHeight,
    pendingInviteCount,
    ref,
    setSearchQuery: setSearch,
    isLoading,
    searchedUsers,
    inviteSuggestions,
    sendPendingInvites,
    shouldDisplayInviteButton,
  };
};

export const InviteModal = (props: IBaseModalProps) => {
  const {
    modalHeight,
    searchedUsers,
    inviteSuggestions,
    isLoading,
    ref,
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
      ref={ref}
      //disableHideHandler
      style={modalStyle}
    >
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
          ListHeaderComponent={() => <ShareStreamLinkButton />}
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
    height: 40,
    width: 40,
  },
  button: {
    position: 'absolute',
    paddingBottom: 15,
    backgroundColor: colors.cod_gray,
    bottom: 0,
    left: 30,
    right: 30,
  },
});
