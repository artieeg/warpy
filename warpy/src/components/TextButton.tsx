import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import {Text} from './Text';

interface ITextButtonProps extends TouchableWithoutFeedbackProps {
  title: string;
}

export const TextButton = (props: ITextButtonProps) => {
  return (
    <TouchableWithoutFeedback {...props} style={{}}>
      <View
        style={[
          styles.wrapper,
          props.disabled && styles.disabled,
          props.style,
        ]}>
        <Text
          size="small"
          color={props.disabled ? 'white' : 'dark'}
          weight="bold">
          {props.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9F871',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: '#373131',
  },
});
