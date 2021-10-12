import React from 'react';
import {TextInput, StyleSheet, TextInputProps} from 'react-native';
import {textStyles} from './Text';

export const SignUpInput = (props: TextInputProps) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#7b7b7b"
      style={[textStyles.bold, textStyles.white, textStyles.large]}
    />
  );
};
