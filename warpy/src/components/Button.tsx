import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Text} from './Text';

interface IButtonProps {
  title: string;
  onPress?: any;
  filled?: boolean;
}

export const Button = (props: IButtonProps) => {
  const {onPress, title, filled} = props;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.button, filled ? styles.filled : null]}>
        <Text weight="bold">{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 65,
    borderRadius: 35,
    backgroundColor: '#011A287A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: '#011A28',
  },
});
