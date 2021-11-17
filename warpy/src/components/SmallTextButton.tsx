import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Text} from './Text';

interface IButtonProps {
  title: string;
  onPress?: any;
  style?: any;
  color?: keyof typeof colorStyles;
  outline?: boolean;
}

export const SmallTextButton = (props: IButtonProps) => {
  const {onPress, style, title, outline, color} = props;

  return (
    <View>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={[
            styles.button,
            colorStyles[color || 'main'],
            outline ? styles.outline : null,
            style,
          ]}>
          <Text weight="bold" color={outline ? 'button' : 'dark'} size="xsmall">
            {title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const colorStyles = StyleSheet.create({
  main: {
    backgroundColor: '#F9F871',
    borderColor: '#F9F871',
  },
  info: {
    backgroundColor: '#7B7B7B',
    borderColor: '#7B7B7B',
  },
  important: {
    backgroundColor: '#F97971',
    borderColor: '#F97971',
  },
});

const styles = StyleSheet.create({
  outline: {
    backgroundColor: 'transparent',
  },
  button: {
    alignSelf: 'baseline',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
