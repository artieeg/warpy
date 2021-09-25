import {useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';

export const useKickHandler = () => {
  const navigation = useNavigation();
  const api = useStore.use.api();
  const appUser = useStore.use.user();
  const show = useStore.use.showToastMessage();

  useEffect(() => {
    api.stream.onUserKick(({user}) => {
      if (appUser?.id === user) {
        show('You have been kicked from this room', 'LONG');

        navigation.goBack();
      }
    });
  }, [navigation, appUser?.id]);
};
