import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AwardModel} from '@warpy/lib';
import {Text} from './Text';
import FastImage from 'react-native-fast-image';

interface AwardOptionProps {
  award: AwardModel;
  picked: boolean;
  onPick: () => void;
}

export const AwardOption = ({award, picked, onPick}: AwardOptionProps) => {
  const {price, media} = award;

  return (
    <TouchableOpacity style={[styles.wrapper]} onPress={onPick}>
      <View style={[styles.mediaContainer, picked && styles.picked]}>
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
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fff',
  },
  price: {
    flex: 1,
    marginTop: 5,
  },
  picked: {
    backgroundColor: '#F9F871',
  },
});
