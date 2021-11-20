import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {IAwardModel} from '@warpy/lib';
import {Text} from './Text';
import FastImage from 'react-native-fast-image';

interface AwardOptionProps {
  award: IAwardModel;
}

export const AwardOption = ({award}: AwardOptionProps) => {
  const {price, media} = award;

  return (
    <TouchableOpacity style={styles.wrapper}>
      <View style={styles.mediaContainer}>
        <FastImage source={{uri: media}} style={styles.media} />
      </View>
      <Text size="xsmall" style={styles.price}>
        {price}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  media: {
    flex: 1,
    aspectRatio: 1,
  },
  mediaContainer: {
    borderRadius: 100,
    padding: 10,
    width: '70%',
    aspectRatio: 1,
    backgroundColor: '#fff',
  },
  price: {
    flex: 1,
    marginTop: 5,
  },
});
