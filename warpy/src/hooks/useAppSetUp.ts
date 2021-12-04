import {useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';
import {navigation} from '@app/navigation';
import config from '@app/config';

export const useAppSetUp = () => {
  const n = useNavigation();

  navigation.current = n;

  const loadTokens = useStore.use.loadTokens();
  const accessToken = useStore.use.access();
  const tokenLoadError = useStore.use.tokenLoadError();

  const [
    createAPISubscriptions,
    connect,
    userExists,
    isLoadingUser,
    api,
    user,
    dispatchUserLoadData,
    dispatchFetchAppInvite,
  ] = useStore(
    state => [
      state.createAPISubscriptions,
      state.connect,
      state.exists,
      state.isLoadingUser,
      state.api,
      state.user,
      state.dispatchUserLoadData,
      state.dispatchFetchAppInvite,
    ],
    shallow,
  );

  useEffect(() => {
    connect(config.WS);

    createAPISubscriptions({
      onStreamIdAvailable: id =>
        navigation.current?.navigate('Stream', {stream: {id}}),
    });

    return () => {
      api.observer.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (user) {
      n.navigate('Feed');

      useStore.getState().dispatchNotificationsFetchUnread();
      useStore.getState().dispatchFetchAppInvite();
    }
  }, [user, n]);

  useEffect(() => {
    loadTokens();
  }, [n, api]);

  useEffect(() => {
    if (tokenLoadError || (userExists === false && isLoadingUser === false)) {
      n.navigate('SignUpName');
    }
  }, [tokenLoadError, userExists, isLoadingUser]);

  useEffect(() => {
    if (accessToken) {
      dispatchUserLoadData(accessToken);
    }
  }, [accessToken]);
};
