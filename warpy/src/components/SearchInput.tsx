import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

export const SearchInput = (props: TextInputProps) => {
  return (
    <TextInput {...props} style={styles.input} placeholderTextColor="#fff" />
  );
};

const styles = StyleSheet.create({
  input: {
    textAlign: 'center',
    height: 50,
    //marginHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    backgroundColor: '#202020',
    color: '#fff',
    fontFamily: 'MontserratAlternates-ExtraBold',
  },
});
