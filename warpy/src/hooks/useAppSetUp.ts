import {useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';

export const useAppSetUp = () => {
  const navigation = useNavigation();

  const loadTokens = useStore.use.loadTokens();
  const accessToken = useStore.use.access();
  const tokenLoadError = useStore.use.tokenLoadError();

  const [
    createAPISubscriptions,
    userExists,
    isLoadingUser,
    api,
    user,
    dispatchUserLoadData,
  ] = useStore(
    state => [
      state.createAPISubscriptions,
      state.exists,
      state.isLoadingUser,
      state.api,
      state.user,
      state.dispatchUserLoadData,
    ],
    shallow,
  );

  useEffect(() => {
    createAPISubscriptions();

    return () => {
      api.observer.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigation.navigate('Feed');
      useStore.getState().dispatchNotificationsFetchUnread();
    }
  }, [user, navigation]);

  useEffect(() => {
    loadTokens();
  }, [navigation, api]);

  useEffect(() => {
    if (tokenLoadError || (userExists === false && isLoadingUser === false)) {
      navigation.navigate('SignUpName');
    }
  }, [tokenLoadError, userExists, isLoadingUser]);

  useEffect(() => {
    if (accessToken) {
      dispatchUserLoadData(accessToken);
    }
  }, [accessToken]);
};
