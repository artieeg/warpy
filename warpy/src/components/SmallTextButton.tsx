import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';
import {colors, Colors} from '../../colors';
import {Text} from './Text';

type ButtonColorStyles = keyof typeof colorStyles;

interface IButtonProps extends ViewProps {
  title: string;
  onPress?: any;
  color?: ButtonColorStyles | Colors; //🤡
  outline?: boolean;
  textColor?: Colors;
}

export const SmallTextButton = (props: IButtonProps) => {
  const {onPress, style, title, outline, color} = props;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.button,
          colorStyles[color as ButtonColorStyles] || {
            backgroundColor: colors[color as Colors],
          },
          !color && colorStyles.main,
          outline ? styles.outline : null,
          style,
        ]}>
        <Text
          weight="extraBold"
          color={props.textColor || 'cod_gray'}
          size="small">
          {title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const colorStyles = StyleSheet.create({
  main: {
    backgroundColor: colors.yellow,
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
