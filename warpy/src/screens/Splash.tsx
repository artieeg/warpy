import {getCurrentUser} from '@app/actions';
import {WebSocketContext} from '@app/components';
import {useAppUser} from '@app/hooks';
import {accessToken, loadTokens} from '@app/services';
import {useAppDispatch} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const user = useAppUser();
  const ws = useContext(WebSocketContext);

  useEffect(() => {
    if (user) {
      navigation.navigate('Feed');
    }
  }, [user, navigation]);

  useEffect(() => {
    loadTokens()
      .then(() => {
        ws?.auth(accessToken);
      })
      .catch(() => navigation.navigate('DevSignUp'));
  }, [navigation, dispatch, ws]);

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
