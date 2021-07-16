import React from 'react';
import {StyleSheet, View} from 'react-native';

interface IRoundButton {
  children: React.ReactChild;
  style?: any;
}

export const RoundButton = (props: IRoundButton) => {
  const {children, style} = props;

  return <View style={[styles.wrapper, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#011A287F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
