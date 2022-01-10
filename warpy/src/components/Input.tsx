import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {colors} from '../../colors';

export const Input = (props: TextInputProps) => {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.boulder}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    textAlign: 'center',
    height: 40,
    //marginHorizontal: 20,
    borderRadius: 25,
    backgroundColor: colors.white,
    //backgroundColor: '#373131',
    color: colors.cod_gray,
    fontFamily: 'MontserratAlternates-ExtraBold',
  },
});
