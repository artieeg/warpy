import {accessToken, loadTokens} from '@app/services';
import {useParticipantsStore, useUserStore} from '@app/stores';
import {useAPIStore} from '@app/stores/useAPIStore';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Splash = () => {
  const navigation = useNavigation();

  const {api} = useAPIStore();

  const participantStore = useParticipantsStore();

  useEffect(() => {
    participantStore.setupAPIListeners();

    return () => {
      api.observer.removeAllListeners();
    };
  }, []);

  const {user, loadUserData} = useUserStore();

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
