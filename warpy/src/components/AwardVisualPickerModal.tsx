import {useStyle} from '@app/hooks';
import {useStore, useStoreShallow} from '@app/store';
import React, {useCallback, useState} from 'react';
import {
  FlatList,
  useWindowDimensions,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useQuery} from 'react-query';
import {TextButton} from '@warpy/components';
import {BaseSlideModal} from './BaseSlideModal';
import {Input} from './Input';
import {useDebounce} from 'use-debounce/lib';
import {colors} from '../../colors';

export const AwardVisualPickerModal = () => {
  const [visible, picked, usernameToAward] = useStoreShallow(state => [
    state.modalCurrent === 'award-visual',
    state.pickedAwardVisual,
    state.modalUserToAward?.username,
  ]);

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const visuals = useQuery(
    ['award-visuals', debouncedSearch],
    async () => {
      if (debouncedSearch.length > 0) {
        const {gifs} = await useStore
          .getState()
          .api.gifs.search(debouncedSearch);

        return gifs;
      }

      return SUGGESTED_VISUALS;
    },
    {
      initialData: SUGGESTED_VISUALS,
      enabled: true,
    },
  );

  const imageWidth = (useWindowDimensions().width - 30 * 4) / 3;
  const awardVisualStyle = useStyle({
    width: imageWidth,
    height: imageWidth,
    borderRadius: imageWidth / 2,
    overflow: 'hidden',
    backgroundColor: '#303030',
    borderWidth: 3,
    borderColor: 'transparent',
  });

  const flatListStyle = useStyle({
    height: imageWidth * 3 + 30 * 2,
    width: '100%',
  });

  const onSelectVisual = useCallback((visual: string) => {
    useStore.getState().set({
      pickedAwardVisual: visual,
    });
  }, []);

  const renderItem = useCallback(
    ({item}: {index: number; item: string}) => {
      return (
        <TouchableOpacity
          onPress={() => onSelectVisual(item)}
          style={styles.awardWrapper}>
          <FastImage
            source={{uri: item}}
            style={[awardVisualStyle, picked === item && styles.picked]}
          />
          <View style={styles.hack} />
          <View style={{width: 30}} />
        </TouchableOpacity>
      );
    },
    [imageWidth, picked],
  );

  const onNext = useCallback(() => {
    useStore.getState().dispatchModalOpen('award-message');
  }, []);

  return (
    <BaseSlideModal
      visible={visible}
      title="award visual"
      subtitle={`for ${usernameToAward}`}>
      <Input
        onChangeText={setSearch}
        placeholder="search gifs via tenor"
        style={styles.search}
      />
      <FlatList
        style={flatListStyle}
        contentContainerStyle={styles.awards}
        numColumns={3}
        renderItem={renderItem}
        data={visuals.data ?? []}
      />
      <View style={styles.button}>
        <TextButton onPress={onNext} disabled={!picked} title="next" />
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
  picked: {
    borderColor: colors.green,
  },
});
