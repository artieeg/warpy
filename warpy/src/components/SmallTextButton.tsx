import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Text} from './Text';

interface IButtonProps {
  title: string;
  onPress?: any;
  style?: any;
}

export const SmallTextButton = (props: IButtonProps) => {
  const {onPress, style, title} = props;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.button, style]}>
        <Text weight="bold" color="dark" size="xsmall">
          {title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'baseline',
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 35,
    backgroundColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
