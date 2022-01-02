import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';
import {Text} from './Text';

interface IButtonProps extends ViewProps {
  title: string;
  onPress?: any;
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
          <Text weight="bold" color="dark" size="xsmall">
            {title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const colorStyles = StyleSheet.create({
  main: {
    backgroundColor: '#BDF971',
  },
  info: {
    backgroundColor: '#7B7B7B',
  },
  important: {
    backgroundColor: '#F97971',
  },
});

const styles = StyleSheet.create({
  outline: {
    backgroundColor: 'transparent',
  },
  button: {
    //alignSelf: 'baseline',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
