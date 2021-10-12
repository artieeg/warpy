import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from '@app/components';
import {useGifs} from '@app/hooks/useGifs';
import FastImage from 'react-native-fast-image';
import {AvatarOption} from '@app/components/AvatarOption';
import {useStore} from '@app/store';
import {SearchInput} from '@app/components/SearchInput';
import {ConfirmButton} from '@app/components/ConfirmButton';
import {useNavigation} from '@react-navigation/native';

export const SignUpAvatar = () => {
  const [search, setSearch] = useState('');
  const gifs = useGifs(search);

  const navigation = useNavigation();

  const [signUpAvatar, signUpName, signUpUsername] = useStore(state => [
    state.signUpAvatar,
    state.signUpName,
    state.signUpUsername,
  ]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.space} size="large" weight="extraBold">
          /join/avatar
        </Text>
        <ConfirmButton onPress={() => navigation.navigate('Loading')} />
      </View>

      <View style={styles.user}>
        <FastImage source={{uri: signUpAvatar}} style={styles.avatar} />
        <View style={{marginLeft: 20}}>
          <Text weight="bold">{signUpName}</Text>
          <Text weight="bold" size="small">
            {signUpUsername}
          </Text>
        </View>
      </View>
      <SearchInput
        onChangeText={text => setSearch(text)}
        placeholder="search gifs via Tenor"
      />
      <FlatList
        data={[...gifs, ...gifs, ...gifs, ...gifs]}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        renderItem={({item, index}) => {
          return <AvatarOption avatar={item} index={index} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  space: {
    marginBottom: 40,
  },
  confirm: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  listContent: {
    paddingTop: 40,
  },
  list: {
    borderRadius: 12,
    marginBottom: -40,
    overflow: 'hidden',
    transform: [{translateY: -35}],
    zIndex: -1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
