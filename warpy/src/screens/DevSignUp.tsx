import {setToken, signUpWithDev} from '@app/services';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';

export const DevSignUp = () => {
  const [username, setUsername] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  const onSignUp = useCallback(async () => {
    const {refresh, access} = await signUpWithDev({
      username,
      lastName,
      firstName,
      email,
    });

    console.log(refresh, access);
    await setToken(access, 'access');
    await setToken(refresh, 'refresh');

    navigation.reset({
      index: 0,
      routes: [{name: 'Splash'}],
    });
  }, [username, lastName, navigation, firstName, email]);

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