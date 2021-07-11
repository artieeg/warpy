import {getCurrentUser} from '@app/actions';
import {loadTokens} from '@app/services';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    loadTokens()
      .then(getCurrentUser)
      .catch(() => {
        navigation.navigate('DevSignUp');
      });
  }, [navigation]);

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
