import React from 'react';
import {StyleSheet, Text as BaseText} from 'react-native';

type TextWeight = 'regular' | 'bold' | 'light';
type TextSize = 'small' | 'medium' | 'large';

interface ITextProps {
  children: string;
  weight?: TextWeight;
  size?: TextSize;
}

export const Text = (props: ITextProps) => {
  const {children, weight, size} = props;

  return (
    <BaseText style={[styles[weight || 'regular'], styles[size || 'medium']]}>
      {children}
    </BaseText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
  },
  regular: {
    fontFamily: 'Dosis-Regular',
  },
  bold: {
    fontFamily: 'Dosis-Bold',
  },
  light: {
    fontFamily: 'Dosis-Light',
  },
  small: {
    fontSize: 20,
  },
  medium: {
    fontSize: 24,
  },
  large: {
    fontSize: 28,
  },
});
