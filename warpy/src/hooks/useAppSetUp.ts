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

  const [userExists, isLoadingUser, api, user] = useStore(
    state => [state.exists, state.isLoadingUser, state.api, state.user],
    shallow,
  );

  useEffect(() => {
    useStore.getState().connect(config.WS);

    useStore.getState().createAPISubscriptions({
      onStreamIdAvailable: id =>
        navigation.current?.navigate('Stream', {stream: {id}}),
    });

    api.onError(error => useStore.getState().dispatchToastMessage(error.error));

    return () => {
      api.observer.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (user) {
      n.navigate('Feed');

      useStore.getState().dispatchNotificationsFetchUnread();
      useStore.getState().dispatchFetchAppInvite();
      useStore.getState().dispatchFetchFriendFeed();
      useStore.getState().dispatchFetchUserList('following');
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
      useStore.getState().dispatchUserLoadData(accessToken);
    }
  }, [accessToken]);
};
