import {useDispatcher, useStore, useStoreShallow} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {navigation} from '@app/navigation';
import config from '@app/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAppSetUp = () => {
  const n = useNavigation();
  navigation.current = n;

  const dispatch = useDispatcher();
  const [
    userExists,
    initialFeedFetchDone,
    isLoadingUser,
    api,
    user,
    isConnected,
    selectedFeedCategory,
  ] = useStoreShallow(state => [
    state.exists,
    state.initialFeedFetchDone,
    state.isLoadingUser,
    state.api,
    state.user,
    state.isConnected,
    state.selectedFeedCategory,
  ]);

  useEffect(() => {
    useStore.getState().connect(config.WS);

    useStore.getState().createAPISubscriptions({
      onStreamIdAvailable: id =>
        navigation.current?.navigate('Stream', {stream: {id}}),
      onStreamEnd: () => {
        navigation.current?.navigate('Feed');
      },
    });

    api.onError(error =>
      dispatch(({toast}) => toast.showToastMessage(error.error)),
    );
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

  const [action, setAction] = useState<'nav-feed' | 'nav-signup'>();

  useEffect(() => {
    if (user && selectedFeedCategory) {
      //n.navigate('Feed');

      setAction('nav-feed');

      dispatch(({notification}) => notification.fetchUnread());
      dispatch(({app_invite}) => app_invite.get());
      dispatch(({feed}) => feed.fetchFeedPage({initial: true}));
    }
  }, [user, n, selectedFeedCategory]);

  useEffect(() => {
    if (user && initialFeedFetchDone) {
      setAction('nav-feed');
    }
  }, [user, initialFeedFetchDone]);

  useEffect(() => {
    if (userExists === false && isLoadingUser === false) {
      //n.navigate('SignUpName');
      setAction('nav-signup');
    }
  }, [userExists, isLoadingUser]);

  useEffect(() => {
    (async () => {
      if (isConnected) {
        const token = await AsyncStorage.getItem('access');

        if (token) {
          dispatch(({user}) => user.loadUserData(token));
        } else {
          setAction('nav-signup');
          //n.navigate('SignUpName');
        }
      }
    })();
  }, [isConnected]);

  return action;
};
