import {WebSocketContext} from '@app/components';
import {useAppUser} from '@app/hooks';
import {User} from '@app/models';
import {accessToken, loadTokens} from '@app/services';
import {useUserStore} from '@app/stores';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Splash = () => {
  const navigation = useNavigation();

  const user = useAppUser();
  const ws = useContext(WebSocketContext);

  useEffect(() => {
    if (user) {
      navigation.navigate('Feed');
    }
  }, [user, navigation]);

  useEffect(() => {
    loadTokens()
      .then(async () => {
        const userData = await ws.user.auth(accessToken);
        useUserStore.getState().set({user: User.fromJSON(userData)});
      })
      .catch(() => navigation.navigate('DevSignUp'));
  }, [navigation, ws]);

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
