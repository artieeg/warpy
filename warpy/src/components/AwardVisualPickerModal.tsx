import {useStyle} from '@app/hooks';
import {useStoreShallow} from '@app/store';
import React, {useCallback} from 'react';
import {FlatList, useWindowDimensions, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useQuery} from 'react-query';
import {BaseSlideModal} from './BaseSlideModal';

export const AwardVisualPickerModal = () => {
  const [visible, usernameToAward] = useStoreShallow(state => [
    state.modalCurrent === 'award-visual',
    state.modalUserToAward?.username,
  ]);

  const visuals = useQuery(
    'award-visuals',
    async () => {
      return [];
    },
    {
      initialData: SUGGESTED_VISUALS,
      enabled: false,
    },
  );

  const imageWidth = (useWindowDimensions().width - 20 * 4) / 3;
  const awardVisualStyle = useStyle({
    width: imageWidth,
    height: imageWidth,
    borderRadius: imageWidth / 2,
    overflow: 'hidden',
    backgroundColor: '#303030',
  });

  const renderItem = useCallback(
    ({item, index}: {index: number; item: string}) => {
      return (
        <View style={styles.awardWrapper}>
          <FastImage source={{uri: item}} style={awardVisualStyle} />
          <View style={styles.hack} />
          <View style={{width: 20}} />
        </View>
      );
    },
    [imageWidth],
  );

  return (
    <BaseSlideModal
      visible
      title="award visual"
      subtitle={`for ${usernameToAward}`}>
      <FlatList
        contentContainerStyle={styles.awards}
        numColumns={3}
        renderItem={renderItem}
        data={visuals.data ?? []}
      />
    </BaseSlideModal>
  );
};

const SUGGESTED_VISUALS = [
  'https://media1.tenor.com/images/bfeaafa2ff74d740f1920174ce796ef3/tenor.gif',
  'https://media1.tenor.com/images/bfeaafa2ff74d740f1920174ce796ef3/tenor.gif',
  'https://media1.tenor.com/images/bfeaafa2ff74d740f1920174ce796ef3/tenor.gif',
  'https://media1.tenor.com/images/bfeaafa2ff74d740f1920174ce796ef3/tenor.gif',
  'https://media1.tenor.com/images/bfeaafa2ff74d740f1920174ce796ef3/tenor.gif',
  'https://media1.tenor.com/images/bfeaafa2ff74d740f1920174ce796ef3/tenor.gif',
  'https://media1.tenor.com/images/bfeaafa2ff74d740f1920174ce796ef3/tenor.gif',
  'https://media1.tenor.com/images/bfeaafa2ff74d740f1920174ce796ef3/tenor.gif',
  'https://media1.tenor.com/images/bfeaafa2ff74d740f1920174ce796ef3/tenor.gif',
];

const styles = StyleSheet.create({
  awardWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    overflow: 'hidden',
  },
  awards: {
    paddingHorizontal: 20,
  },
  hack: {
    zIndex: 10,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
