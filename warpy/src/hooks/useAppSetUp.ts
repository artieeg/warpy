import {useDispatcher, useStore, useStoreShallow} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {navigation} from '@app/navigation';
import config from '@app/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAppSetUp = () => {
  const n = useNavigation();
  navigation.current = n;

  const dispatch = useDispatcher();
  const [userExists, isLoadingUser, api, user, isConnected] = useStoreShallow(
    state => [
      state.exists,
      state.isLoadingUser,
      state.api,
      state.user,
      state.isConnected,
    ],
  );

  useEffect(() => {
    useStore.getState().connect(config.WS);

    useStore.getState().createAPISubscriptions({
      onStreamIdAvailable: id =>
        navigation.current?.navigate('Stream', {stream: {id}}),
      onStreamEnd: () => {
        navigation.current?.navigate('Feed');
      },
    });

    //api.onError(error => useStore.getState().dispatchToastMessage(error.error));
    api.onError(error =>
      dispatch(({toast}) => toast.showToastMessage(error.error)),
    );

    return () => {
      api.observer.removeAllListeners();
    };
  }, []);

  //Load previous reaction if exists
  useEffect(() => {
    AsyncStorage.getItem('reaction').then(code => {
      if (code) {
        useStore.getState().set({
          reaction: code,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      n.navigate('Feed');

      dispatch(({notification}) => notification.fetchUnread());
      dispatch(({app_invite}) => app_invite.get());
    }
  }, [user, n]);

  useEffect(() => {
    if (userExists === false && isLoadingUser === false) {
      n.navigate('SignUpName');
    }
  }, [userExists, isLoadingUser]);

  useEffect(() => {
    (async () => {
      if (isConnected) {
        const token = await AsyncStorage.getItem('access');

        if (token) {
          dispatch(({user}) => user.loadUserData(token));
        } else {
          n.navigate('SignUpName');
        }
      }
    })();
  }, [isConnected]);
};
