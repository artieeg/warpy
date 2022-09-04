import {Input, ScreenHeader} from '@app/components';
import {AvatarOption} from '@app/components/AvatarOption';
import {useGifs} from '@app/hooks/useGifs';
import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useDebounce} from 'use-debounce';
import {colors} from '../../colors';

export const useAvatarPickerScreenController = () => {
  const [_query, setQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(_query, 300);

  const gifs = useGifs(debouncedSearchQuery);

  return {
    gifs,
    setSearchQuery: setQuery,
  };
};

export const AvatarPickerScreen = () => {
  const {gifs, setSearchQuery} = useAvatarPickerScreenController();

  return (
    <View style={styles.screen}>
      <ScreenHeader />
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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  input: {
    marginHorizontal: 30,
    marginTop: 30,
  },
});
