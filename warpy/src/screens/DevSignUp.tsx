import {setToken} from '@app/services';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import {useAPIStore} from '@app/stores/useAPIStore';

export const DevSignUp = () => {
  const [username, setUsername] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  const {api} = useAPIStore();

  const onSignUp = useCallback(async () => {
    const {refresh, access} = await api.user.create({
      username,
      last_name: lastName,
      first_name: firstName,
      email,
      kind: 'dev',
    });

    await setToken(access, 'access');
    await setToken(refresh, 'refresh');

    navigation.reset({
      index: 0,
      routes: [{name: 'Splash'}],
    });
  }, [username, api, lastName, navigation, firstName, email]);

  return (
    <View style={styles.wrapper}>
      <TextInput onChangeText={setUsername} placeholder="username" />
      <TextInput onChangeText={setFirstName} placeholder="first name" />
      <TextInput onChangeText={setLastName} placeholder="last name" />
      <TextInput onChangeText={setEmail} placeholder="email" />
      <Button onPress={onSignUp} title="sign up" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    paddingTop: 80,
  },
});
