import {accessToken, loadTokens} from '@app/services';
import {useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Splash = () => {
  const navigation = useNavigation();

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
    loadTokens()
      .then(async () => {
        loadUserData(accessToken);
      })
      .catch(() => navigation.navigate('DevSignUp'));
  }, [navigation, api]);

  return (
    <View style={styles.screen}>
      <Text>Logo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
