import {WebSocketContext} from '@app/components';
import {useAppUser} from '@app/hooks';
import {accessToken, loadTokens} from '@app/services';
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
        const user = await ws.user.auth(accessToken);
        console.log('user', user);
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
