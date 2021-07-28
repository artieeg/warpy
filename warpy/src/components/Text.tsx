import React from 'react';
import {TextProps} from 'react-native';
import {StyleSheet, Text as BaseText} from 'react-native';

type TextWeight = 'regular' | 'bold' | 'light';
type TextSize = 'small' | 'medium' | 'large';

interface ITextProps extends TextProps {
  weight?: TextWeight;
  size?: TextSize;
  color?: 'dark' | 'bright';
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
    color: '#fff',
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
