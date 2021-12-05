import {useStore} from '@app/store';
import {useWindowDimensions} from 'react-native';
import shallow from 'zustand/shallow';
import {useInviteSuggestions} from './useInviteSuggestions';
import {useUserSearch} from './useUserSearch';

export const useInviteModalController = () => {
  const {users: searchedUsers, isLoading, setSearch} = useUserSearch();
  const inviteSuggestions = useInviteSuggestions();
  const [
    pendingInviteCount,
    visible,
    sendPendingInvites,
    shouldDisplayInviteButton,
  ] = useStore(
    state => [
      state.pendingInviteUserIds.length,
      state.modalCurrent === 'invite',
      state.dispatchSendPendingInvites,
      !!state.stream,
    ],
    shallow,
  );

  const modalHeight = useWindowDimensions().height * 0.9;

  return {
    modalHeight,
    pendingInviteCount,
    visible,
    setSearchQuery: setSearch,
    isLoading,
    searchedUsers,
    inviteSuggestions,
    sendPendingInvites,
    shouldDisplayInviteButton,
  };
};
