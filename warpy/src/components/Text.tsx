import React from 'react';
import {TextProps} from 'react-native';
import {StyleSheet, Text as BaseText} from 'react-native';

type TextWeight = 'regular' | 'bold' | 'light';
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

const styles = StyleSheet.create({
  dark: {
    color: '#2A2A58',
  },
  bright: {
    color: '#EEE5E9',
  },
  info: {
    color: '#7B7B7B',
  },
  regular: {
    fontFamily: 'Nunito-Regular',
  },
  bold: {
    fontFamily: 'Nunito-Bold',
  },
  light: {
    fontFamily: 'Nunito-Light',
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
    fontSize: 28,
  },
});
