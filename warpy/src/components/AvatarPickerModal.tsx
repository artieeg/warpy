import React from 'react';
import {useGifs} from '@app/hooks/useGifs';
import {StyleSheet} from 'react-native';
import {useDebounce} from 'use-debounce';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {Input} from './Input';
import {useModalRef} from '@app/hooks/useModalRef';
import Image from 'react-native-fast-image';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatcher} from '@app/store';

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

  const dispatch = useDispatcher();

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
        numColumns={4}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                dispatch(({user, modal}) => {
                  user.setAvatar(item);
                  modal.close();
                  ref.current?.close();
                });
              }}
            >
              <Image style={styles.avatar} source={{uri: item}} />
            </TouchableOpacity>
          );
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
  avatar: {
    marginRight: 10,
    marginBottom: 10,
    width: 60,
    height: 60,
    borderRadius: 40,
    overflow: 'hidden',
  },
});
