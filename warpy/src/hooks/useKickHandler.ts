import {useDispatcher, useStoreShallow} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';

export const useKickHandler = () => {
  const navigation = useNavigation();
  const [api, appUser] = useStoreShallow(store => [store.api, store.user]);
  const dispatch = useDispatcher();

  useEffect(() => {
    api.stream.onUserKick(({user}) => {
      if (appUser?.id === user) {
        dispatch(({toast}) =>
          toast.showToastMessage('You have been kicked from this room', 'LONG'),
        );

        navigation.goBack();
      }
    });
  }, [navigation, appUser?.id]);
};
