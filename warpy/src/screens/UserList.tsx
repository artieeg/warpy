import {useStore} from '@app/store';
import {FetchNextFn} from '@app/store/dispatchers/user_list';
import {useRoute} from '@react-navigation/native';
import React, {useRef} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {UserList} from '@warpy/lib';
import useAsyncEffect from 'use-async-effect';
import {ScreenHeader} from '@app/components';
import {UserListItem} from '@app/components/UserListItem';

export const UserListScreen = () => {
  const route: any = useRoute();
  const mode: UserList = route.params.mode;

  const [list, dispatchFetchUserList] = useStore(state => [
    (state as any)['list_' + mode].list,
    state.dispatchFetchUserList,
  ]);

  const fetchNextPage = useRef<FetchNextFn>();

  useAsyncEffect(async () => {
    fetchNextPage.current = await dispatchFetchUserList(mode);
  }, []);

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
