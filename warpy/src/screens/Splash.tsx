import {getCurrentUser} from '@app/actions';
import {useAppUser} from '@app/hooks';
import {accessToken, authSocket, loadTokens} from '@app/services';
import {useAppDispatch} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [user, error] = useAppUser();

  useEffect(() => {
    if (user) {
      navigation.navigate('Feed');
    }
  }, [user, error, navigation]);

  useEffect(() => {
    loadTokens()
      .then(() => {
        authSocket(accessToken);
        dispatch(getCurrentUser());
      })
      .catch(() => navigation.navigate('DevSignUp'));
  }, [navigation, dispatch]);

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
