import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '@app/components';
import {SignUpInput} from '@app/components/SignUpInput';
import {ConfirmButton} from '@app/components/ConfirmButton';
import {useStore} from '@warpy/store';
import {useNavigation} from '@react-navigation/native';

export const SignUpName = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.space} size="large" weight="extraBold">
        /join
      </Text>

      <ConfirmButton
        style={styles.confirm}
        onPress={() => navigation.navigate('SignUpUsername')}
      />

      <SignUpInput
        onChangeText={text => useStore.setState({signUpName: text})}
        placeholder="type your name"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  space: {
    marginBottom: 20,
  },
  confirm: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
