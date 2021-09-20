import {Toast} from '@app/components';
import {useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {useToast} from './useToast';

export const useKickHandler = () => {
  const navigation = useNavigation();
  const api = useStore.use.api();
  const appUser = useStore.use.user();
  const toast = useToast();

  useEffect(() => {
    api.stream.onUserKick(({user}) => {
      if (appUser?.id === user) {
        toast.show({
          text: 'You have been kicked from this room',
          duration: Toast.LONG,
        });

        navigation.goBack();
      }
    });
  }, [navigation, appUser?.id]);
};
