import {useStore} from '@app/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

export const Loading = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const {
      api,
      dispatchToastMessage,
      signUpAvatar,
      signUpUsername,
      signUpName,
    } = useStore.getState();

    api.user
      .create({
        username: signUpUsername,
        last_name: signUpName,
        avatar: signUpAvatar,
        first_name: signUpName,
        email: 'test',
        kind: 'dev',
      })
      .then(async ({refresh, access}) => {
        await Promise.all([
          AsyncStorage.setItem('access', access),
          AsyncStorage.setItem('refresh', refresh),
        ]);

        dispatchToastMessage('welcome to warpy!');

        navigation.reset({
          index: 0,
          routes: [{name: 'Splash'}],
        });
      });
  }, []);

  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size="large" color="#BDF971" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
