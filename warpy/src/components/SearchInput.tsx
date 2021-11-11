import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

export const SearchInput = (props: TextInputProps) => {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor="#fff"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    textAlign: 'center',
    height: 50,
    //marginHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#373131',
    color: '#fff',
    fontFamily: 'MontserratAlternates-ExtraBold',
  },
});
