import {useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';

export const useAppSetUp = () => {
  const navigation = useNavigation();

  const loadTokens = useStore.use.loadTokens();
  const accessToken = useStore.use.access();
  const tokenLoadError = useStore.use.tokenLoadError();

  const [createAPISubscriptions, api, user, loadUserData] = useStore(state => [
    state.createAPISubscriptions,
    state.api,
    state.user,
    state.loadUserData,
  ]);

  useEffect(() => {
    createAPISubscriptions();

    return () => {
      api.observer.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigation.navigate('Feed');
    }
  }, [user, navigation]);

  useEffect(() => {
    loadTokens();
  }, [navigation, api]);

  useEffect(() => {
    if (tokenLoadError) {
      navigation.navigate('DevSignUp');
    }
  }, [tokenLoadError]);

  useEffect(() => {
    if (accessToken) {
      loadUserData(accessToken);
    }
  }, [accessToken]);
};
