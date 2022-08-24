import {useDispatcher, useStoreShallow} from '@app/store';
import {useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {UserList} from '@warpy/lib';
import {ScreenHeader} from '@app/components';
import {UserListItem} from '@app/components/UserListItem';

export const UserListScreen = () => {
  const route: any = useRoute();
  const mode: UserList = route.params.mode;

  const dispatch = useDispatcher();

  const [list] = useStoreShallow(state => [
    (state as any)['list_' + mode].list,
  ]);

  useEffect(() => {
    dispatch(({user}) => user.fetchUserList(mode as any));
  }, [mode]);

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <FlatList
        contentContainerStyle={styles.container}
        data={list}
        ItemSeparatorComponent={() => <View style={{height: 15}} />}
        renderItem={({item}) => {
          return <UserListItem key={item.id} user={item} list={mode} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    paddingHorizontal: 20,
  },
});
