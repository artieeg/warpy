import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Text} from './Text';

interface IButtonProps {
  title: string;
  onPress?: any;
  style?: any;
  color?: keyof typeof colorStyles;
}

export const SmallTextButton = (props: IButtonProps) => {
  const {onPress, style, title, color} = props;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.button, colorStyles[color || 'main'], style]}>
        <Text weight="bold" color="dark" size="xsmall">
          {title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const colorStyles = StyleSheet.create({
  main: {
    backgroundColor: '#F9F871',
  },
  important: {
    backgroundColor: '#F97971',
  },
});

const styles = StyleSheet.create({
  button: {
    alignSelf: 'baseline',
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
