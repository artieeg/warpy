import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {Icon} from './Icon';
import {Text} from './Text';

interface CoinBalanceProps extends ViewProps {
  balance?: number;
}

export const CoinBalance = ({balance, style}: CoinBalanceProps) => {
  return (
    <View style={[styles.wrapper, style]}>
      <Icon name="plus" size={16} style={styles.coin} />
      <Text size="xsmall" color="dark">
        {balance}
      </Text>
      <Icon name="plus" size={16} style={styles.add} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  coin: {
    transform: [{translateY: 1}],
    marginRight: 10,
  },
  add: {
    transform: [{translateY: 1}],
    marginLeft: 10,
  },
});
