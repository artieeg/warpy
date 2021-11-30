import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '@app/components';
import {SignUpInput} from '@app/components/SignUpInput';
import {ConfirmButton} from '@app/components/ConfirmButton';
import {useStore} from '@warpy/store';
import {useNavigation} from '@react-navigation/native';

export const SignUpUsername = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.space} size="large" weight="extraBold">
        /join
      </Text>

      <ConfirmButton
        onPress={() => navigation.navigate('SignUpAvatar')}
        style={styles.confirm}
      />

      <SignUpInput
        onChangeText={text => useStore.setState({signUpUsername: text})}
        placeholder="your username"
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
