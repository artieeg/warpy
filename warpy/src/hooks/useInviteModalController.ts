import {useWindowDimensions} from 'react-native';
import {useInviteSuggestions} from './useInviteSuggestions';
import {useUserSearch} from './useUserSearch';

export const useInviteModalController = () => {
  const {users: searchedUsers, isLoading, setSearch} = useUserSearch();
  const inviteSuggestions = useInviteSuggestions();

  const modalHeight = useWindowDimensions().height * 0.9;

  return {
    modalHeight,
    setSearchQuery: setSearch,
    isLoading,
    searchedUsers,
    inviteSuggestions,
  };
};
