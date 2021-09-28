import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

export const UserSearchInput = ({
  onChangeText,
}: {
  onChangeText: (text: string) => void;
}) => {
  return (
    <TextInput
      onChangeText={onChangeText}
      style={styles.input}
      placeholderTextColor="#fff"
      placeholder="search"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    textAlign: 'center',
    height: 50,
    marginHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    backgroundColor: '#202020',
    color: '#fff',
    fontFamily: 'MontserratAlternates-ExtraBold',
  },
});
