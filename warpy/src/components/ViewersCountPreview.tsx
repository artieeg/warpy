import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';

interface IViewersCountProps {
  count: number;
  style: any;
}

export const ViewersCountPreview = (props: IViewersCountProps) => {
  return (
    <View style={[styles.wrapper, props.style]}>
      <Text size="xsmall" weight="bold">
        {'+' + props.count.toString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    //backgroundColor: '#011A287F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
