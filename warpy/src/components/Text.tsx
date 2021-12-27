import React from 'react';
import {TextProps} from 'react-native';
import {StyleSheet, Text as BaseText} from 'react-native';

type TextWeight = 'regular' | 'bold' | 'light' | 'extraBold';
type TextColor = 'dark' | 'bright' | 'info' | 'yellow' | 'alert' | 'white';
type TextSize = 'small' | 'medium' | 'large' | 'xsmall' | 'xxsmall';

interface ITextProps extends TextProps {
  weight?: TextWeight;
  size?: TextSize;
  color?: TextColor;
  italic?: boolean;
  children: any;
}

export const Text = (props: ITextProps) => {
  const {color, italic, weight, size, style} = props;

  return (
    <BaseText
      {...props}
      style={[
        textStyles[color || 'bright'],
        textStyles[weight || 'bold'],
        textStyles[size || 'medium'],
        italic && textStyles.italic,
        style,
      ]}
    />
  );
};

export const textStyles = StyleSheet.create({
  italic: {},
  dark: {
    color: '#000',
  },
  white: {
    color: '#fff',
  },
  bright: {
    color: '#BDF971',
  },
  yellow: {
    color: '#F9F871',
  },
  alert: {
    color: '#F97971',
  },
  info: {
    color: '#7B7B7B', //'#474141',
  },
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
  medium: {
    fontSize: 24,
  },
  large: {
    fontSize: 30,
  },
});
