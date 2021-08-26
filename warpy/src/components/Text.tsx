import React from 'react';
import {TextProps} from 'react-native';
import {StyleSheet, Text as BaseText} from 'react-native';

type TextWeight = 'regular' | 'bold' | 'light' | 'extraBold';
type TextColor = 'dark' | 'bright' | 'info';
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
        styles[color || 'bright'],
        styles[weight || 'regular'],
        styles[size || 'medium'],
        style,
      ]}>
      {children}
    </BaseText>
  );
};

export const styles = StyleSheet.create({
  dark: {
    color: '#000',
  },
  bright: {
    color: '#BDF971',
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
