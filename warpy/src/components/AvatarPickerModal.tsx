import React from 'react';
import {useGifs} from '@app/hooks/useGifs';
import {FlatList, StyleSheet} from 'react-native';
import {useDebounce} from 'use-debounce';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {Input} from './Input';
import {AvatarOption} from './AvatarOption';
import {useModalRef} from '@app/hooks/useModalRef';

export const useAvatarPickerModalController = () => {
  const ref = useModalRef('avatar-picker');

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const gifs = useGifs(debouncedSearchQuery);

  return {
    ref,
    setSearchQuery,
    gifs,
  };
};

export const AvatarPickerModal: React.FC<IBaseModalProps> = props => {
  const {ref, gifs, setSearchQuery} = useAvatarPickerModalController();

  return (
    <BaseSlideModal
      style={styles.modal}
      title="pick new avatar"
      {...props}
      ref={ref}
    >
      <Input
        onChangeText={text => setSearchQuery(text)}
        style={styles.input}
        placeholder="search gifs via Tenor"
      />
      <FlatList
        contentContainerStyle={styles.container}
        data={gifs}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        renderItem={({item, index}) => {
          return <AvatarOption avatar={item} index={index} />;
        }}
      />
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    maxHeight: '90%',
    height: '90%',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  input: {
    marginHorizontal: 30,
    marginTop: 30,
  },
});
