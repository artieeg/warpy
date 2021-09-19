import React from 'react';
import {TextProps} from 'react-native';
import {StyleSheet, Text as BaseText} from 'react-native';

type TextWeight = 'regular' | 'bold' | 'light' | 'extraBold';
type TextColor = 'dark' | 'bright' | 'info' | 'button' | 'alert';
type TextSize = 'small' | 'medium' | 'large' | 'xsmall';

interface ITextProps extends TextProps {
  weight?: TextWeight;
  size?: TextSize;
  color?: TextColor;
  children: string;
}

export const Text = (props: ITextProps) => {
  const {children, color, weight, size, style} = props;

  return (
    <BaseText
      {...props}
      style={[
        textStyles[color || 'bright'],
        textStyles[weight || 'regular'],
        textStyles[size || 'medium'],
        style,
      ]}>
      {children}
    </BaseText>
  );
};

export const textStyles = StyleSheet.create({
  dark: {
    color: '#000',
  },
  bright: {
    color: '#BDF971',
  },
  button: {
    color: '#F9F871',
  },
  alert: {
    color: '#F97971',
  },
  info: {
    color: '#474141',
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
