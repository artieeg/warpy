import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../colors';
import {Text} from './Text';

interface IViewersCountProps {
  count: number;
  style: any;
}

export const ViewersCountPreview = (props: IViewersCountProps) => {
  return (
    <View style={[styles.wrapper, props.style]}>
      <Text size="xxsmall" weight="bold" color="white">
        {'+' + props.count.toString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: colors.mine_shaft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
