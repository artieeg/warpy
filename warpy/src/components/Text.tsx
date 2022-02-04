import React from 'react';
import {TextProps} from 'react-native';
import {StyleSheet, Text as BaseText} from 'react-native';
import Animated from 'react-native-reanimated';
import {Colors, colors} from '../../colors';

type TextWeight = 'regular' | 'bold' | 'light' | 'extraBold';
type TextSize = 'small' | 'normal' | 'medium' | 'large' | 'xsmall' | 'xxsmall';

interface ITextProps extends TextProps {
  weight?: TextWeight;
  size?: TextSize;
  color?: Colors;
  italic?: boolean;
  style?: any;
  children: any;
  animated?: boolean;
}

export const Text = (props: ITextProps) => {
  const {color, italic, animated, weight, size, style} = props;

  if (animated) {
    return (
      <Animated.Text
        {...props}
        style={[
          {color: colors[color || 'green']},
          textStyles[weight || 'bold'],
          textStyles[size || 'medium'],
          italic && textStyles.italic,
          style,
        ]}
      />
    );
  } else {
    return (
      <BaseText
        {...props}
        style={[
          {color: colors[color || 'green']},
          textStyles[weight || 'bold'],
          textStyles[size || 'medium'],
          italic && textStyles.italic,
          style,
        ]}
      />
    );
  }
};

export const textStyles = StyleSheet.create({
  italic: {},
  regular: {
    fontFamily: 'MontserratAlternates-Regular',
  },
  bold: {
    fontFamily: 'MontserratAlternates-Bold',
  },
  extraBold: {
    fontFamily: 'MontserratAlternates-ExtraBold',
  },
  light: {
    fontFamily: 'MontserratAlternates-Light',
  },
  xsmall: {
    fontSize: 16,
  },
  xxsmall: {
    fontSize: 12,
  },
  small: {
    fontSize: 18,
  },
  normal: {
    fontSize: 20,
  },
  medium: {
    fontSize: 24,
  },
  large: {
    fontSize: 30,
  },
});
