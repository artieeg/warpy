import {useStyle} from '@app/hooks';
import {useStoreShallow} from '@app/store';
import React, {useCallback} from 'react';
import {FlatList, useWindowDimensions, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useQuery} from 'react-query';
import {TextButton} from '@warpy/components';
import {BaseSlideModal} from './BaseSlideModal';
import {Input} from './Input';

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

  const imageWidth = (useWindowDimensions().width - 30 * 4) / 3;
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
          <View style={{width: 30}} />
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
      <Input placeholder="search gifs via tenor" style={styles.search} />
      <FlatList
        contentContainerStyle={styles.awards}
        numColumns={3}
        renderItem={renderItem}
        data={visuals.data ?? []}
      />
      <View style={styles.button}>
        <TextButton title="next" />
      </View>
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
    paddingHorizontal: 30,
    paddingTop: 20,
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
  search: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
});
